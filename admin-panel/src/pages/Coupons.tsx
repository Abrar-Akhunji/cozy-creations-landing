import React, { useState, useEffect } from "react";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Tag, Plus, Trash2, ToggleLeft, ToggleRight, Copy, CheckCircle2,
  Loader2, CalendarDays, Percent, IndianRupee, ShoppingCart, RefreshCw,
  AlertCircle, Gift, X
} from "lucide-react";

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxUsage: number;       // 0 = unlimited
  usageCount: number;
  expiresAt: string | null; // ISO date string or null
  isActive: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  code: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: "",
  minOrderAmount: "",
  maxUsage: "",
  expiresAt: "",
};

export const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, "coupons"), orderBy("createdAt", "desc"))
      );
      setCoupons(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon)));
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  // Listen for FAB "add coupon" event dispatched from App.tsx
  useEffect(() => {
    const handler = () => { setShowForm(true); setForm(EMPTY_FORM); setError(""); };
    window.addEventListener("krashe-add-coupon", handler);
    return () => window.removeEventListener("krashe-add-coupon", handler);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = form.code.trim().toUpperCase().replace(/\s+/g, "");
    if (!code) { setError("Coupon code is required."); return; }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      setError("Discount value must be greater than 0."); return;
    }
    if (form.discountType === "percentage" && Number(form.discountValue) > 100) {
      setError("Percentage discount cannot exceed 100%."); return;
    }

    // Duplicate code check
    const existingSnap = await getDocs(collection(db, "coupons"));
    const duplicate = existingSnap.docs.some(
      (d) => (d.data().code as string).toUpperCase() === code
    );
    if (duplicate) { setError(`Coupon code "${code}" already exists.`); return; }

    setSaving(true);
    try {
      await addDoc(collection(db, "coupons"), {
        code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxUsage: Number(form.maxUsage) || 0,
        usageCount: 0,
        expiresAt: form.expiresAt || null,
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      await fetchCoupons();
    } catch (err: any) {
      setError(err.message || "Failed to create coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await updateDoc(doc(db, "coupons", coupon.id), { isActive: !coupon.isActive });
      setCoupons((prev) =>
        prev.map((c) => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c)
      );
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "coupons", id));
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const isExpired = (c: Coupon) => !!c.expiresAt && new Date(c.expiresAt) < new Date();
  const isExhausted = (c: Coupon) => c.maxUsage > 0 && c.usageCount >= c.maxUsage;

  const getStatusBadge = (c: Coupon) => {
    if (!c.isActive)     return { label: "Disabled",  cls: "bg-zinc-800 text-zinc-400" };
    if (isExpired(c))    return { label: "Expired",   cls: "bg-red-950/60 text-red-400" };
    if (isExhausted(c))  return { label: "Exhausted", cls: "bg-orange-950/60 text-orange-400" };
    return { label: "Active", cls: "bg-green-950/60 text-green-400" };
  };

  const formatDiscount = (c: Coupon) =>
    c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`;

  return (
    <div className="space-y-6">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Gift className="size-6 text-primary" /> Coupon Codes
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Create and manage discount coupons for your storefront.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCoupons}
            className="h-9 px-3 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 flex items-center gap-1.5 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => { setShowForm(true); setForm(EMPTY_FORM); setError(""); }}
            className="h-9 px-4 rounded-lg bg-primary text-[#0d0e12] text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="size-3.5" /> New Coupon
          </button>
        </div>
      </div>

      {/* ── Create Modal ─────────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#13141a] border border-border rounded-2xl overflow-hidden shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Tag className="size-4 text-primary" /> Create New Coupon
              </h3>
              <button
                onClick={() => { setShowForm(false); setError(""); }}
                className="size-7 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary flex items-center justify-center transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl p-3">
                  <AlertCircle className="size-4 shrink-0" /> {error}
                </div>
              )}

              {/* Code */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Coupon Code *
                </label>
                <input
                  type="text" required placeholder="e.g. TWIN20, SAVE100, WELCOME10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full h-10 rounded-xl border border-border bg-white/5 px-4 text-sm font-mono font-bold tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all uppercase"
                />
              </div>

              {/* Discount Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Discount Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["percentage", "fixed"] as const).map((type) => (
                    <button
                      key={type} type="button"
                      onClick={() => setForm({ ...form, discountType: type })}
                      className={`h-10 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        form.discountType === type
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-white/5 text-text-secondary hover:bg-white/10"
                      }`}
                    >
                      {type === "percentage"
                        ? <><Percent className="size-3.5" /> Percentage</>
                        : <><IndianRupee className="size-3.5" /> Fixed Amount</>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Value */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {form.discountType === "percentage" ? "Discount % *" : "Discount Amount (₹) *"}
                </label>
                <input
                  type="number" required min={1}
                  max={form.discountType === "percentage" ? 100 : undefined}
                  placeholder={form.discountType === "percentage" ? "e.g. 20 (for 20% off)" : "e.g. 100 (for ₹100 off)"}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  className="w-full h-10 rounded-xl border border-border bg-white/5 px-4 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Min Order + Max Usage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Min Order (₹)
                  </label>
                  <input
                    type="number" min={0} placeholder="0 = no minimum"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="w-full h-10 rounded-xl border border-border bg-white/5 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Max Uses
                  </label>
                  <input
                    type="number" min={0} placeholder="0 = unlimited"
                    value={form.maxUsage}
                    onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                    className="w-full h-10 rounded-xl border border-border bg-white/5 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Expiry */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Expiry Date <span className="normal-case font-normal">(optional — leave blank for no expiry)</span>
                </label>
                <input
                  type="date"
                  value={form.expiresAt}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full h-10 rounded-xl border border-border bg-white/5 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Live Preview */}
              {form.code && form.discountValue && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
                  <span className="font-mono font-bold text-primary tracking-widest text-sm">
                    {form.code.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-text-primary">
                    {form.discountType === "percentage"
                      ? `${form.discountValue}% OFF`
                      : `₹${form.discountValue} OFF`}
                    {form.minOrderAmount ? ` on orders ≥ ₹${form.minOrderAmount}` : ""}
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(""); }}
                  className="flex-1 h-10 rounded-xl border border-border text-text-secondary text-xs font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 h-10 rounded-xl bg-primary text-[#0d0e12] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving
                    ? <Loader2 className="size-4 animate-spin" />
                    : <><Tag className="size-4" /> Create Coupon</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Stats Bar ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Coupons",
            value: coupons.length,
            color: "text-text-primary"
          },
          {
            label: "Active",
            value: coupons.filter(c => c.isActive && !isExpired(c) && !isExhausted(c)).length,
            color: "text-green-400"
          },
          {
            label: "Expired / Used Up",
            value: coupons.filter(c => isExpired(c) || isExhausted(c)).length,
            color: "text-red-400"
          },
          {
            label: "Total Redemptions",
            value: coupons.reduce((a, c) => a + c.usageCount, 0),
            color: "text-primary"
          },
        ].map(stat => (
          <div key={stat.label} className="glass border border-border rounded-xl p-4">
            <p className="text-[9px] uppercase tracking-wider font-bold text-text-muted">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Coupon List ──────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-text-secondary">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-sm">Loading coupons...</span>
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="size-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <Gift className="size-8 text-primary/50" />
          </div>
          <div>
            <p className="text-text-primary font-semibold">No coupon codes yet</p>
            <p className="text-text-secondary text-xs mt-1">
              Click "New Coupon" to create your first discount code.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {coupons.map((coupon) => {
            const badge = getStatusBadge(coupon);
            const copied = copiedId === coupon.id;
            const faded = !coupon.isActive || isExpired(coupon) || isExhausted(coupon);

            return (
              <div
                key={coupon.id}
                className={`glass border rounded-2xl p-5 transition-all ${
                  faded
                    ? "border-border/50 opacity-55"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* Left: Code + info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-lg text-primary tracking-widest">
                        {coupon.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                        {formatDiscount(coupon)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <ShoppingCart className="size-3" />
                        {coupon.minOrderAmount > 0 ? `Min ₹${coupon.minOrderAmount}` : "No minimum"}
                      </span>
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <RefreshCw className="size-3" />
                        {coupon.usageCount} / {coupon.maxUsage === 0 ? "∞" : coupon.maxUsage} uses
                      </span>
                      {coupon.expiresAt && (
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          Expires {new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(coupon.code, coupon.id)}
                      title="Copy code"
                      className="size-9 rounded-lg border border-border bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {copied
                        ? <CheckCircle2 className="size-4 text-green-400" />
                        : <Copy className="size-4" />}
                    </button>

                    <button
                      onClick={() => handleToggle(coupon)}
                      title={coupon.isActive ? "Disable coupon" : "Enable coupon"}
                      className={`size-9 rounded-lg border flex items-center justify-center transition-colors ${
                        coupon.isActive
                          ? "border-green-500/30 bg-green-950/20 text-green-400 hover:bg-green-950/40"
                          : "border-border bg-white/5 text-text-muted hover:bg-white/10"
                      }`}
                    >
                      {coupon.isActive
                        ? <ToggleRight className="size-4" />
                        : <ToggleLeft className="size-4" />}
                    </button>

                    <button
                      onClick={() => handleDelete(coupon.id, coupon.code)}
                      title="Delete coupon"
                      className="size-9 rounded-lg border border-red-500/20 bg-red-950/10 hover:bg-red-950/25 text-red-400 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
