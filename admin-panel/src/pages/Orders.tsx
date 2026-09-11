import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { BottomDrawer } from "../components/BottomDrawer";
import {
  Loader2,
  Phone,
  MapPin,
  ShieldCheck,
  Clock,
  Package,
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface Order {
  id: string;
  utr: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
  items: OrderItem[];
  totalPrice: number;
  shippingFee: number;
  orderTotal: number;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt: string;
}

const STATUS_FILTERS = ["All", "Pending", "Completed", "Cancelled"] as const;

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cleaningDupes, setCleaningDupes] = useState(false);
  const [dupeCount, setDupeCount] = useState(0);

  // Realtime listener
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
        setOrders(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Orders subscription error:", err);
        setError(err.message || "Failed to load orders.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  // Format timestamp
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }) + ", " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  // Status badge class
  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending": return "admin-badge admin-badge-pending";
      case "Completed": return "admin-badge admin-badge-completed";
      case "Cancelled": return "admin-badge admin-badge-cancelled";
      default: return "admin-badge";
    }
  };

  // Open order detail
  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  // Update order status
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      await updateDoc(doc(db, "orders", selectedOrder.id), { status: newStatus });
      setSelectedOrder({ ...selectedOrder, status: newStatus as Order["status"] });
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete a single order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Delete this order permanently? This cannot be undone.")) return;
    setDeletingId(orderId);
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setDrawerOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Auto-clean all duplicate UTR orders (keep the earliest, delete the rest)
  const handleCleanDuplicates = async () => {
    setCleaningDupes(true);
    try {
      const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "asc")));
      const seenUtrs = new Set<string>();
      const toDelete: string[] = [];

      snap.docs.forEach((d) => {
        const utr = (d.data().utr || "").trim();
        if (!utr) return;
        if (seenUtrs.has(utr)) {
          toDelete.push(d.id);
        } else {
          seenUtrs.add(utr);
        }
      });

      if (toDelete.length === 0) {
        alert("✅ No duplicate orders found. Your database is clean!");
        return;
      }

      const confirmed = window.confirm(
        `Found ${toDelete.length} duplicate order(s) with repeated UTR IDs.\nDelete them all now?`
      );
      if (!confirmed) return;

      await Promise.all(toDelete.map((id) => deleteDoc(doc(db, "orders", id))));
      setDupeCount(toDelete.length);
      alert(`🧹 Cleaned! Removed ${toDelete.length} duplicate order(s).`);
    } catch (err) {
      console.error("Clean duplicates error:", err);
      alert("Failed to clean duplicates. Check console.");
    } finally {
      setCleaningDupes(false);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "Pending").length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const revenue = orders
      .filter((o) => o.status === "Completed")
      .reduce((sum, o) => sum + (o.orderTotal || 0), 0);
    return { pending, completed, revenue };
  }, [orders]);

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: "80px 0" }}>
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#ef4444" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Failed to Load Orders</h3>
        <p style={{ fontSize: 13, color: "var(--admin-text-muted)", marginTop: 8 }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="admin-btn-ghost"
          style={{ marginTop: 20, padding: "8px 16px", borderRadius: 10 }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dark">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
              Orders
            </h2>
            <p style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>
              {orders.length} total • {stats.pending} pending • ₹{stats.revenue.toLocaleString("en-IN")} revenue
            </p>
          </div>
          <button
            onClick={handleCleanDuplicates}
            disabled={cleaningDupes}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid rgba(239,68,68,0.4)",
              background: "rgba(239,68,68,0.08)",
              color: "#ef4444",
              fontSize: 11,
              fontWeight: 700,
              cursor: cleaningDupes ? "wait" : "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              opacity: cleaningDupes ? 0.7 : 1,
              letterSpacing: "0.03em",
            }}
          >
            {cleaningDupes ? "Cleaning…" : "🧹 Clean Duplicates"}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Pending", value: stats.pending, color: "var(--admin-warning)" },
          { label: "Completed", value: stats.completed, color: "var(--admin-success)" },
          { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, color: "var(--admin-accent)" },
        ].map((s) => (
          <div
            key={s.label}
            className="admin-card"
            style={{ padding: "12px 14px", textAlign: "center" }}
          >
            <p
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: s.color,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </p>
            <p style={{ fontSize: 10, color: "var(--admin-text-muted)", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Chips */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 16,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: filter === f ? "1px solid var(--admin-accent)" : "1px solid var(--admin-border)",
              background: filter === f ? "var(--admin-accent-muted)" : "transparent",
              color: filter === f ? "var(--admin-accent)" : "var(--admin-text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              flexShrink: 0,
              fontFamily: "inherit",
            }}
          >
            {f}
            {f !== "All" && (
              <span style={{ marginLeft: 4, opacity: 0.7 }}>
                ({orders.filter((o) => f === "All" || o.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredOrders.map((order, idx) => (
          <button
            key={order.id}
            onClick={() => openOrderDetail(order)}
            className="admin-card admin-animate-fade-in-up"
            style={{
              padding: "14px 16px",
              animationDelay: `${idx * 40}ms`,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              display: "block",
              fontFamily: "inherit",
            }}
          >
            {/* Top row: ID + Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                className="admin-font-mono text-sm"
                style={{
                  fontWeight: 800,
                  color: "var(--admin-text)",
                  letterSpacing: "0.02em",
                }}
              >
                {order.id}
              </span>
              <span className={statusBadgeClass(order.status)}>
                {order.status}
              </span>
            </div>

            {/* Timestamp */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--admin-text-muted)",
                marginBottom: 10,
              }}
            >
              <Clock size={12} />
              {formatDate(order.createdAt)}
            </div>

            {/* Customer + Total */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)", margin: 0 }}>
                  {order.name}
                </p>
                {order.utr && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--admin-accent)",
                      marginTop: 2,
                      fontWeight: 600,
                    }}
                  >
                    UTR: {order.utr}
                  </p>
                )}
              </div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "var(--admin-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                ₹{(order.orderTotal || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--admin-text-muted)",
          }}
        >
          <Package size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 14, fontWeight: 600 }}>
            {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
          </p>
        </div>
      )}

      {/* Order Detail Drawer */}
      <BottomDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedOrder(null);
        }}
        title={`Order Details`}
      >
        {selectedOrder && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Status Switcher */}
            <div>
              <label className="admin-label">Order Status</label>
              <select
                className="admin-select"
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
              >
                <option value="Pending">⏳ Pending</option>
                <option value="Completed">✅ Completed</option>
                <option value="Cancelled">❌ Cancelled</option>
              </select>
            </div>

            {/* UTR Verification Box */}
            {selectedOrder.utr && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "var(--admin-accent-muted)",
                  border: "1px solid rgba(217, 119, 6, 0.3)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <ShieldCheck size={16} style={{ color: "var(--admin-accent)" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--admin-accent)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Ledger Verification
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--admin-text-secondary)", margin: "0 0 8px", lineHeight: 1.5 }}>
                  Verify UTR <span className="admin-font-mono" style={{ color: "var(--admin-accent)", fontWeight: 800, fontSize: 13 }}>{selectedOrder.utr}</span> against
                  your bank ledger before dispatching this order.
                </p>
              </div>
            )}

            {/* Customer Details */}
            <div>
              <label className="admin-label">Customer Details</label>
              <div
                className="admin-card"
                style={{ padding: "14px 16px" }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-text)", margin: "0 0 8px" }}>
                  {selectedOrder.name}
                </p>

                <a
                  href={`tel:${selectedOrder.phone}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--admin-accent)",
                    textDecoration: "none",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  <Phone size={13} />
                  {selectedOrder.phone}
                </a>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "var(--admin-text-secondary)" }}>
                  <MapPin size={13} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span>
                    {selectedOrder.address}
                    {selectedOrder.pincode && ` — ${selectedOrder.pincode}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <label className="admin-label">
                Items Ordered ({selectedOrder.items?.length || 0})
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="admin-card"
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: 12,
                    }}
                  >
                    {/* Image preview */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "var(--admin-bg-subtle)",
                        flexShrink: 0,
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                          <Package size={18} style={{ color: "var(--admin-text-muted)" }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--admin-text)",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--admin-text-muted)", marginTop: 2, margin: "2px 0 0" }}>
                        {item.selectedSize !== "N/A" && `Size: ${item.selectedSize}`}
                        {item.selectedSize !== "N/A" && item.selectedColor !== "N/A" && " • "}
                        {item.selectedColor !== "N/A" && `Color: ${item.selectedColor}`}
                        {item.selectedSize === "N/A" && item.selectedColor === "N/A" && "Standard"}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 4,
                        }}
                      >
                        <span style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>
                          Qty: {item.quantity}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--admin-accent)" }}>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <label className="admin-label">Payment Summary</label>
              <div
                className="admin-card"
                style={{ padding: "14px 16px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--admin-text-secondary)", marginBottom: 6 }}>
                  <span>Subtotal</span>
                  <span>₹{(selectedOrder.totalPrice || 0).toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--admin-text-secondary)", marginBottom: 10 }}>
                  <span>Shipping Fee</span>
                  <span>{selectedOrder.shippingFee === 0 ? "Free" : `₹${selectedOrder.shippingFee}`}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--admin-text)",
                    paddingTop: 10,
                    borderTop: "1px solid var(--admin-border)",
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: "var(--admin-accent)" }}>
                    ₹{(selectedOrder.orderTotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <p style={{ fontSize: 11, color: "var(--admin-text-muted)", textAlign: "center" }}>
              Order placed: {formatDate(selectedOrder.createdAt)}
            </p>

            {/* Delete Order */}
            <button
              onClick={() => handleDeleteOrder(selectedOrder.id)}
              disabled={deletingId === selectedOrder.id}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid rgba(239,68,68,0.4)",
                background: "rgba(239,68,68,0.08)",
                color: "#ef4444",
                fontSize: 13,
                fontWeight: 700,
                cursor: deletingId === selectedOrder.id ? "wait" : "pointer",
                fontFamily: "inherit",
                opacity: deletingId === selectedOrder.id ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {deletingId === selectedOrder.id ? "Deleting…" : "🗑 Delete This Order"}
            </button>
          </div>
        )}
      </BottomDrawer>
    </div>
  );
};
