import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Minus, Plus, ArrowLeft, ArrowRight, ShieldCheck, Clock,
  CheckCircle2, QrCode, X, Mail, User, Phone, MapPin, Hash,
  Loader2, AlertCircle, Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PAYMENT_CONFIG, createUpiPaymentUrl, createWhatsAppUrl } from "@/config/payment";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { db } from "@/config/firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from "firebase/firestore";
import { toast } from "sonner";

const SHIPPING_COST = 80;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

const Cart = () => {
  const { items, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [utr, setUtr] = useState("");
  const [saveProfile, setSaveProfile] = useState(true);

  // Payment state
  const [timeLeft, setTimeLeft] = useState(300);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  // ── KEY FIX #1: Freeze total before cart is cleared ─────────────────────────
  // `total` becomes ₹0 after clearCart() because items becomes [].
  // We snapshot it into `frozenTotal` the moment the order is submitted.
  const [frozenTotal, setFrozenTotal] = useState(0);

  // ── Coupon system ────────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "checking" | "valid" | "error">("idle");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
  } | null>(null);

  // ── KEY FIX #2: Real UTR verification state ──────────────────────────────────
  const [utrStatus, setUtrStatus] = useState<"idle" | "checking" | "valid" | "error">("idle");
  const [utrErrorMsg, setUtrErrorMsg] = useState("");

  // Computed totals (live, from cart items)
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  // Coupon discount — computed live from applied coupon
  const discount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
      : Math.min(appliedCoupon.discountValue, subtotal)
    : 0;
  const finalTotal = Math.max(total - discount, 0);

  const upiPaymentUrl = createUpiPaymentUrl(frozenTotal || finalTotal);

  // Load saved profile on mount
  useEffect(() => {
    const saved = localStorage.getItem("twinhooks_user_profile");
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        if (profile.name) setName(profile.name);
        if (profile.email) setEmail(profile.email);
        if (profile.phone) setPhone(profile.phone);
        if (profile.address) setAddress(profile.address);
        if (profile.pincode) setPincode(profile.pincode);
      } catch (e) {
        console.error("Failed to parse saved user profile:", e);
      }
    }
  }, []);

  // Session countdown (only during step 3)
  useEffect(() => {
    if (step !== 3) return;
    if (timeLeft <= 0) {
      toast.error("Payment session expired. Please restart checkout.");
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Step 2 → Step 3
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      toast.error("Please fill in all shipping details.");
      return;
    }
    if (saveProfile) {
      localStorage.setItem("twinhooks_user_profile", JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
      }));
    }
    // Snapshot finalTotal NOW before any cart clearing
    setFrozenTotal(finalTotal);
    setTimeLeft(300);
    setUtr("");
    setUtrStatus("idle");
    setStep(3);
  };

  // ── Coupon apply/remove handlers ─────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setCouponStatus("checking");
    setCouponError("");

    try {
      const snap = await getDocs(
        query(collection(db, "coupons"), where("code", "==", code))
      );

      if (snap.empty) {
        setCouponStatus("error");
        setCouponError("Invalid coupon code. Please check and try again.");
        setAppliedCoupon(null);
        return;
      }

      const couponDoc = snap.docs[0];
      const c = couponDoc.data();

      if (!c.isActive) {
        setCouponStatus("error");
        setCouponError("This coupon has been disabled.");
        setAppliedCoupon(null);
        return;
      }
      if (c.expiresAt && new Date(c.expiresAt) < new Date()) {
        setCouponStatus("error");
        setCouponError("This coupon has expired.");
        setAppliedCoupon(null);
        return;
      }
      if (c.maxUsage > 0 && c.usageCount >= c.maxUsage) {
        setCouponStatus("error");
        setCouponError("This coupon has reached its usage limit.");
        setAppliedCoupon(null);
        return;
      }
      if (c.minOrderAmount > 0 && subtotal < c.minOrderAmount) {
        setCouponStatus("error");
        setCouponError(`Minimum order of ₹${c.minOrderAmount} required for this coupon.`);
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon({
        id: couponDoc.id,
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
      });
      setCouponStatus("valid");
      toast.success(
        `🎉 Coupon applied! You save ${
          c.discountType === "percentage" ? c.discountValue + "%" : "₹" + c.discountValue
        }`
      );
    } catch {
      setCouponStatus("error");
      setCouponError("Failed to verify coupon. Please try again.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponStatus("idle");
    setCouponError("");
  };

  // ── KEY FIX #3: Real-time Firestore UTR verification ────────────────────────
  const handleVerifyUtr = async () => {
    const trimmed = utr.trim();

    if (trimmed.length !== 12) {
      toast.error("UTR must be exactly 12 digits.");
      return;
    }

    setUtrStatus("checking");
    setUtrErrorMsg("");

    try {
      const dupSnap = await getDocs(
        query(collection(db, "orders"), where("utr", "==", trimmed))
      );

      if (!dupSnap.empty) {
        setUtrStatus("error");
        setUtrErrorMsg("This UTR is already linked to an existing order. Each UTR can only be used once.");
        toast.error("Duplicate UTR detected. This transaction ID has already been used.");
      } else {
        setUtrStatus("valid");
        toast.success("✅ UTR verified! You may now confirm your order.");
      }
    } catch (err) {
      setUtrStatus("error");
      setUtrErrorMsg("Verification failed. Please check your internet connection and try again.");
      toast.error("Could not verify UTR. Please retry.");
    }
  };

  // Reset UTR verification whenever the user changes the input
  const handleUtrChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setUtr(digits);
    if (utrStatus !== "idle") {
      setUtrStatus("idle");
      setUtrErrorMsg("");
    }
  };

  // Final submit: save order to Firestore
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error("Payment session has expired. Please restart checkout.");
      return;
    }

    // ── KEY FIX #4: Block submit if UTR not verified ─────────────────────────
    if (utrStatus !== "valid") {
      toast.error("Please verify your UTR/Transaction ID before confirming.");
      return;
    }

    const trimmedUtr = utr.trim();

    if (trimmedUtr.length !== 12) {
      toast.error("UTR ID must be exactly 12 digits.");
      return;
    }

    setLoading(true);

    try {
      // Final server-side duplicate check (race condition guard)
      const dupSnap = await getDocs(
        query(collection(db, "orders"), where("utr", "==", trimmedUtr))
      );
      if (!dupSnap.empty) {
        toast.error("This UTR was already used. Cannot place duplicate order.");
        setUtrStatus("error");
        setUtrErrorMsg("This UTR was already used by another order.");
        setLoading(false);
        return;
      }

      const captureFrozenTotal = frozenTotal || finalTotal;

      const orderData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        utr: trimmedUtr,
        couponCode: appliedCoupon?.code || null,
        couponDiscount: discount,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
          selectedSize: item.size || "N/A",
          selectedColor: item.color || "N/A",
        })),
        totalPrice: subtotal,
        shippingFee: shipping,
        discountAmount: discount,
        orderTotal: captureFrozenTotal,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(docRef.id);

      // Increment coupon usage count in Firestore
      if (appliedCoupon) {
        await updateDoc(doc(db, "coupons", appliedCoupon.id), {
          usageCount: increment(1),
        });
      }

      // Freeze the total snapshot one more time in case it wasn't set yet
      if (!frozenTotal) setFrozenTotal(captureFrozenTotal);

      clearCart(); // ← items becomes [] here, but frozenTotal is already saved ✅
      setStep(4);
      toast.success("Order registered! Confirm it on WhatsApp to finalize dispatch.");
    } catch (err: any) {
      console.error("Order submission failure:", err);
      toast.error(err.message || "Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── KEY FIX #5: Use frozenTotal in WhatsApp message, not `total` ─────────────
  const handleWhatsAppConfirm = () => {
    const message =
      `Hello TwinHooks! 🧶\n\n` +
      `I just placed an order on your site.\n` +
      `*Order ID:* ${orderId}\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*UTR/Transaction ID:* ${utr}\n` +
      `*Amount Paid:* ${formatCurrency(frozenTotal)}\n` +
      `*Delivery Address:* ${address}, ${pincode}\n\n` +
      `Please verify and process my order. Thank you! 🙏`;
    window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  // ── UTR input border colour helper ───────────────────────────────────────────
  const utrBorderClass =
    utrStatus === "valid"
      ? "border-green-500 ring-2 ring-green-500/20"
      : utrStatus === "error"
      ? "border-red-400 ring-2 ring-red-400/20"
      : utrStatus === "checking"
      ? "border-primary/60"
      : "border-border";

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 4 — Success View
  // ────────────────────────────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-6 animate-in fade-in duration-300">
        <div className="size-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
          Order Placed!
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto text-sm">
          Your order is in our database. Click below to send your payment receipt via WhatsApp
          so we can verify and dispatch it quickly.
        </p>

        <div className="rounded-2xl border border-border bg-card p-5 max-w-sm mx-auto text-left space-y-3 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order Summary
          </p>
          <div className="text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-semibold">Order ID:</span>
              <span className="font-mono text-xs text-foreground">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-semibold">UTR Ref:</span>
              <span className="font-mono tracking-widest text-foreground">{utr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-semibold">Customer:</span>
              <span className="text-foreground">{name}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-1">
              <span className="font-bold text-foreground">Amount Paid:</span>
              {/* Uses frozenTotal — always correct even after cart is cleared */}
              <span className="font-bold text-primary text-base">{formatCurrency(frozenTotal)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={handleWhatsAppConfirm}
            className="h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm"
          >
            Confirm on WhatsApp
          </button>
          <Link
            to="/shop"
            className="h-12 rounded-full border border-border bg-card font-medium flex items-center justify-center hover:bg-accent/40 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Cart Empty
  if (items.length === 0 && step === 1) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-5">
        <h1 className="text-4xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
          Your Shopping Bag
        </h1>
        <p className="text-muted-foreground">
          Your bag is empty. Add a handmade item to begin your order.
        </p>
        <Link
          to="/shop"
          className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-medium text-primary-foreground hover:opacity-95"
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="space-y-2 text-left">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
            {step === 1 ? "Your Shopping Bag" : "Delivery Information"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 1 ? `${itemCount} items selected` : "Secure Checkout Session"}
          </p>
        </div>
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="h-10 px-4 rounded-full border border-border bg-card text-xs font-semibold flex items-center gap-1.5 hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Bag
          </button>
        )}
      </header>

      <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* Step 1: Cart Items */}
        {step === 1 && (
          <section className="space-y-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row gap-5 shadow-card"
              >
                <img
                  src={optimizeCloudinaryUrl(item.product.image, 240)}
                  alt={item.product.name}
                  className="w-full sm:size-24 rounded-2xl object-cover"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold">{item.product.name}</h2>
                      {item.size && <p className="mt-1 text-sm text-muted-foreground">Size: {item.size}</p>}
                      {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                    </div>
                    <button
                      className="text-xs text-muted-foreground hover:text-primary border border-border/60 hover:border-primary/30 px-2.5 py-1 rounded-lg bg-background/40 transition-all"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="font-semibold text-primary">{formatCurrency(item.product.price)}</p>
                    <div className="rounded-full border border-border bg-background px-2 h-10 flex items-center gap-3 w-fit">
                      <button
                        className="w-8 h-8 rounded-full bg-card grid place-items-center hover:bg-accent"
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease ${item.product.name} quantity`}
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        className="w-8 h-8 rounded-full bg-card grid place-items-center hover:bg-accent"
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase ${item.product.name} quantity`}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Step 2: Shipping Form */}
        {step === 2 && (
          <section className="space-y-6 animate-in slide-in-from-left duration-300">
            <form
              onSubmit={handleProceedToPayment}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-card"
            >
              <header className="space-y-1 text-left">
                <h3 className="text-xl font-bold text-[#2E2A26] font-serif-luxury flex items-center gap-2">
                  <MapPin className="size-5 text-primary" /> 1. Delivery Details
                </h3>
                <p className="text-xs text-muted-foreground font-sans-modern">
                  Provide shipment destination information.
                </p>
              </header>

              <div className="space-y-4">
                <div className="text-left space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="size-3.5 text-primary" /> Customer Name
                  </label>
                  <input
                    type="text" required placeholder="Enter full name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2E2A26]"
                  />
                </div>

                <div className="text-left space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" /> Contact Email
                  </label>
                  <input
                    type="email" required placeholder="Enter email address" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2E2A26]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="text-left space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Phone className="size-3.5 text-primary" /> Contact Phone
                    </label>
                    <input
                      type="tel" required placeholder="e.g. 9876543210" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2E2A26]"
                    />
                  </div>
                  <div className="text-left space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Hash className="size-3.5 text-primary" /> Pincode
                    </label>
                    <input
                      type="text" required maxLength={6} placeholder="6-digit ZIP code" value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-11 rounded-xl border border-border bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2E2A26]"
                    />
                  </div>
                </div>

                <div className="text-left space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" /> Full Street Address
                  </label>
                  <textarea
                    required rows={3}
                    placeholder="Apartment, House number, street name, city, state"
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2E2A26] resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2 text-xs font-semibold text-muted-foreground">
                  <input
                    type="checkbox" checked={saveProfile}
                    onChange={(e) => setSaveProfile(e.target.checked)}
                    className="rounded border-border text-primary accent-primary size-4"
                  />
                  Save shipping details to my profile for next time
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                Proceed to Secure Payment <ArrowRight className="size-4" />
              </button>
            </form>
          </section>
        )}

        {/* Order Summary Sidebar */}
        <aside className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-card">
          <h2 className="text-2xl font-semibold font-serif-luxury text-[#2E2A26]">Order Summary</h2>

        {/* Coupon Code Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Tag className="size-3" /> Have a Coupon Code?
            </label>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    if (couponStatus !== "idle") { setCouponStatus("idle"); setCouponError(""); }
                  }}
                  disabled={couponStatus === "checking"}
                  className="flex-1 h-9 rounded-xl border border-border bg-background/50 px-3 text-xs font-mono font-bold tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || couponStatus === "checking"}
                  className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1"
                >
                  {couponStatus === "checking"
                    ? <Loader2 className="size-3 animate-spin" />
                    : "Apply"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-500" />
                  <span className="font-mono font-bold text-green-600 text-xs tracking-widest">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-green-600">
                    ({appliedCoupon.discountType === "percentage"
                      ? `${appliedCoupon.discountValue}% off`
                      : `₹${appliedCoupon.discountValue} off`})
                  </span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-[10px] text-red-400 hover:text-red-500 font-bold transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
            {couponStatus === "error" && (
              <p className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="size-3" /> {couponError}
              </p>
            )}
          </div>

          <div className="space-y-3 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping estimate</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            {appliedCoupon && discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-semibold flex items-center gap-1">
                  <Tag className="size-3" /> Coupon ({appliedCoupon.code})
                </span>
                <span className="font-bold">−{formatCurrency(discount)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 flex justify-between items-end">
            <span className="font-semibold text-sm">Order Total</span>
            <div className="text-right">
              {appliedCoupon && discount > 0 && (
                <p className="text-xs text-muted-foreground line-through">{formatCurrency(total)}</p>
              )}
              <span className="text-3xl font-semibold text-primary">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep(2)}
                className="h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm"
              >
                Proceed to Checkout <ArrowRight className="size-4" />
              </button>
              <Link
                to="/shop"
                className="h-12 rounded-full border border-border bg-background font-medium flex items-center justify-center hover:bg-accent/40 transition-colors text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          {step === 2 && (
            <div className="text-xs text-muted-foreground bg-primary/5 p-4 rounded-xl border border-border/50 text-left leading-relaxed">
              📦 <span className="font-bold text-foreground">Next Step: Secure Payment</span>
              <p className="mt-1">
                Fill in the form and click "Proceed". A secure UPI payment QR Code will open.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Step 3: Payment Modal */}
      {step === 3 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[92dvh] flex flex-col bg-[#FBF8F4] border border-border rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">

            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-2 text-left">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif-luxury text-[#2E2A26] leading-none">
                    Secure UPI Payment
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary mt-1 block">
                    Atelier UPI Gateway
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="size-8 rounded-lg bg-white/50 hover:bg-white flex items-center justify-center text-muted-foreground hover:text-foreground transition-all border border-border"
                aria-label="Cancel payment"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1">

              {/* Timer */}
              <div className="flex items-center justify-between text-xs font-semibold bg-primary/10 border border-primary/20 px-3 py-2 rounded-xl text-primary">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 animate-pulse" /> Session Timer
                </span>
                <span className={`font-mono text-sm ${timeLeft <= 60 ? "text-red-500" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* QR Code */}
              <div className="rounded-2xl border border-border bg-white p-4 flex flex-col items-center gap-3 shadow-inner">
                {timeLeft > 0 ? (
                  <>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPaymentUrl)}`}
                      alt="UPI Payment QR Code"
                      className="size-40 object-contain animate-fade-in"
                    />
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold flex items-center gap-1">
                      <QrCode className="size-3" /> Scan with any UPI App
                    </div>
                  </>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-red-500 font-bold text-sm">Session Expired</span>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Please close and restart checkout.
                    </p>
                  </div>
                )}
              </div>

              {/* Payee Info */}
              <div className="rounded-xl bg-accent/40 p-3 text-xs space-y-1.5 text-left border border-border/40">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-green-600" /> Payee Verified
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Merchant:</span> {PAYMENT_CONFIG.PAYEE_NAME}
                </p>
                <p className="text-muted-foreground break-all">
                  <span className="font-semibold text-foreground">UPI ID:</span> {PAYMENT_CONFIG.UPI_ID}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Amount:</span>{" "}
                  <span className="font-bold text-primary text-sm">{formatCurrency(frozenTotal || total)}</span>
                </p>
              </div>

              {/* UTR Input — with real-time verification */}
              <div className="text-left space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Hash className="size-3" />
                  UTR / Transaction Reference ID
                </label>

                <div className="flex gap-2">
                  {/* Input with dynamic border based on verification state */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      maxLength={12}
                      disabled={timeLeft <= 0 || loading}
                      placeholder="12-digit UTR e.g. 123456789012"
                      value={utr}
                      onChange={(e) => handleUtrChange(e.target.value)}
                      className={`w-full h-11 rounded-xl border bg-white px-4 pr-10 text-sm tracking-widest font-semibold focus:outline-none transition-all text-primary text-center ${utrBorderClass}`}
                    />
                    {/* Status icon inside input */}
                    {utrStatus === "valid" && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-500 pointer-events-none" />
                    )}
                    {utrStatus === "error" && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-red-400 pointer-events-none" />
                    )}
                    {utrStatus === "checking" && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-primary animate-spin pointer-events-none" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyUtr}
                    disabled={loading || timeLeft <= 0 || utr.length !== 12 || utrStatus === "checking" || utrStatus === "valid"}
                    className={`px-4 h-11 rounded-xl font-semibold text-xs transition-all disabled:opacity-50 ${
                      utrStatus === "valid"
                        ? "bg-green-100 text-green-700 border border-green-300 cursor-default"
                        : "bg-accent text-primary hover:bg-accent/80"
                    }`}
                  >
                    {utrStatus === "checking" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : utrStatus === "valid" ? (
                      <CheckCircle2 className="size-4 text-green-600" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>

                {/* Status messages */}
                {utrStatus === "valid" && (
                  <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    UTR verified — this is a unique transaction ID. You may confirm your order.
                  </p>
                )}
                {utrStatus === "error" && (
                  <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {utrErrorMsg}
                  </p>
                )}
                {utrStatus === "idle" && (
                  <span className="text-[9px] text-muted-foreground block leading-tight">
                    After paying, open your UPI app → Transaction History → copy the 12-digit UTR/Ref ID.
                    Click <strong>Verify</strong> before submitting.
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || timeLeft <= 0 || utrStatus !== "valid"}
                  className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : utrStatus !== "valid" ? (
                    "Verify UTR to Continue →"
                  ) : (
                    "✅ Confirm UPI Payment"
                  )}
                </button>
                <a
                  href={upiPaymentUrl}
                  className="h-11 rounded-full border border-border bg-white font-semibold flex items-center justify-center hover:bg-accent/40 transition-colors text-xs text-[#2E2A26]"
                >
                  Pay Direct from Device
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
