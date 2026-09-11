import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Product } from "@/data/products";
import { FirestoreCategory } from "@/context/ProductContext";
import BottomDrawer from "../components/BottomDrawer";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
  Check,
  Palette,
  Ruler,
  ImageIcon,
} from "lucide-react";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formShowColorOption, setFormShowColorOption] = useState(false);
  const [formShowSizeOption, setFormShowSizeOption] = useState(false);
  const [formColors, setFormColors] = useState<string[]>([]);
  const [formSizes, setFormSizes] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Realtime listeners
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
      setProducts(list);
      setLoading(false);
    });

    const unsubCategories = onSnapshot(collection(db, "categories"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FirestoreCategory);
      setCategories(list);
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  // Selection
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      selected.forEach((id) => batch.delete(doc(db, "products", id)));
      await batch.commit();
      clearSelection();
    } catch (err) {
      console.error("Bulk delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  // Single delete
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Open drawer for add
  const openAddDrawer = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice("");
    setFormCategory(categories[0]?.name || "");
    setFormImage("");
    setFormDescription("");
    setFormShowColorOption(false);
    setFormShowSizeOption(false);
    setFormColors([]);
    setFormSizes([]);
    setColorInput("");
    setSizeInput("");
    setDrawerOpen(true);
  };

  // Open drawer for edit
  const openEditDrawer = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(String(p.price));
    setFormCategory(p.category);
    setFormImage(p.image);
    setFormDescription(p.description);
    setFormShowColorOption(!!p.showColorOption);
    setFormShowSizeOption(!!p.showSizeOption);
    setFormColors(p.colors || []);
    setFormSizes(p.sizes || []);
    setColorInput("");
    setSizeInput("");
    setDrawerOpen(true);
  };

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) return;
    setSaving(true);

    const data: Omit<Product, "id"> = {
      name: formName.trim(),
      price: Number(formPrice),
      category: formCategory,
      image: formImage.trim(),
      images: formImage.trim() ? [formImage.trim()] : [],
      description: formDescription.trim(),
      showColorOption: formShowColorOption,
      showSizeOption: formShowSizeOption,
      colors: formShowColorOption ? formColors : [],
      sizes: formShowSizeOption ? formSizes : [],
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), data);
      } else {
        await addDoc(collection(db, "products"), data);
      }
      setDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Add color tag
  const addColor = () => {
    if (colorInput.trim() && !formColors.includes(colorInput.trim())) {
      setFormColors([...formColors, colorInput.trim()]);
      setColorInput("");
    }
  };

  // Add size tag
  const addSize = () => {
    if (sizeInput.trim() && !formSizes.includes(sizeInput.trim())) {
      setFormSizes([...formSizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: "80px 0" }}>
        <Loader2 size={28} className="admin-animate-spin" style={{ color: "var(--admin-accent)" }} />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: selected.size > 0 ? 80 : 0 }}>
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
            Products
          </h2>
          <p style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>
            {products.length} item{products.length !== 1 ? "s" : ""} in catalog
          </p>
        </div>
        <button onClick={openAddDrawer} className="admin-btn-primary" style={{ height: 38, fontSize: 13, borderRadius: 10 }}>
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* Product Grid (2-col mobile) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        {products.map((p, idx) => {
          const isSelected = selected.has(p.id);
          return (
            <div
              key={p.id}
              className="admin-card admin-animate-fade-in-up"
              style={{
                overflow: "hidden",
                animationDelay: `${idx * 40}ms`,
                position: "relative",
                border: isSelected ? "1px solid var(--admin-accent)" : undefined,
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(p.id)}
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 5,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={isSelected ? "Deselect" : "Select"}
              >
                <div className={`admin-checkbox ${isSelected ? "checked" : ""}`}>
                  {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
              </button>

              {/* Image */}
              <div
                style={{
                  aspectRatio: "1 / 1",
                  background: "var(--admin-bg-subtle)",
                  overflow: "hidden",
                }}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>

              {/* Floating pills */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  zIndex: 5,
                }}
              >
                <span
                  style={{
                    background: "rgba(12, 13, 18, 0.85)",
                    backdropFilter: "blur(8px)",
                    color: "var(--admin-accent)",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: 8,
                  }}
                >
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
                {p.showColorOption && (
                  <span
                    style={{
                      background: "rgba(12, 13, 18, 0.85)",
                      backdropFilter: "blur(8px)",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 6,
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    🎨 Colors
                  </span>
                )}
                {p.showSizeOption && (
                  <span
                    style={{
                      background: "rgba(12, 13, 18, 0.85)",
                      backdropFilter: "blur(8px)",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 6,
                      color: "var(--admin-text-secondary)",
                    }}
                  >
                    📏 Sizes
                  </span>
                )}
              </div>

              {/* Info + Actions */}
              <div style={{ padding: "10px 10px 10px" }}>
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    margin: "0 0 4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "var(--admin-text)",
                  }}
                >
                  {p.name}
                </h4>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--admin-text-muted)",
                    margin: "0 0 8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.category}
                </p>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openEditDrawer(p)}
                    className="admin-btn-ghost"
                    style={{ flex: 1, height: 30, fontSize: 11, borderRadius: 8 }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="admin-btn-danger"
                    style={{ height: 30, fontSize: 11, borderRadius: 8, padding: "0 10px" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--admin-text-muted)",
          }}
        >
          <ImageIcon size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 14, fontWeight: 600 }}>No products yet</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Tap "Add New" to create your first product.</p>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div
          className="admin-animate-slide-up"
          style={{
            position: "fixed",
            bottom: 72,
            left: 12,
            right: 12,
            zIndex: 45,
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 16,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(12px)",
          }}
        >
          <button onClick={clearSelection} className="admin-btn-ghost" style={{ height: 34, fontSize: 12 }}>
            <X size={14} /> Cancel
          </button>
          <button
            onClick={handleBulkDelete}
            className="admin-btn-danger"
            style={{ height: 34, fontSize: 12 }}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 size={14} className="admin-animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Delete Selected ({selected.size})
          </button>
        </div>
      )}

      {/* Add/Edit Bottom Drawer */}
      <BottomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Title */}
          <div>
            <label className="admin-label">Product Title</label>
            <input
              className="admin-input"
              placeholder="e.g. Chunky Bohemian Sweater"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
          </div>

          {/* Price + Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="admin-label">Price (INR)</label>
              <input
                className="admin-input"
                type="number"
                min="0"
                placeholder="799"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select
                className="admin-select"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
                {categories.length === 0 && <option value="">No categories</option>}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="admin-label">
              <ImageIcon size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
              Image URL / Path
            </label>
            <input
              className="admin-input"
              placeholder="/products/my-image.jpg or https://..."
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
            />
            {formImage && (
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid var(--admin-border)",
                  height: 120,
                  background: "var(--admin-bg-subtle)",
                }}
              >
                <img
                  src={formImage}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea"
              rows={3}
              placeholder="Describe this handcrafted creation..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          {/* Color Options */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--admin-border)",
              background: "var(--admin-bg-subtle)",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--admin-text)",
              }}
            >
              <input
                type="checkbox"
                checked={formShowColorOption}
                onChange={(e) => setFormShowColorOption(e.target.checked)}
                style={{ accentColor: "var(--admin-accent)" }}
              />
              <Palette size={14} style={{ color: "var(--admin-accent)" }} />
              Enable Color Options
            </label>

            {formShowColorOption && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    className="admin-input"
                    style={{ height: 36, fontSize: 12 }}
                    placeholder="Color name (e.g. Sage Green)"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="admin-btn-primary"
                    style={{ height: 36, padding: "0 12px", fontSize: 12, borderRadius: 8, flexShrink: 0 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {formColors.map((c) => (
                    <span
                      key={c}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "var(--admin-accent-muted)",
                        color: "var(--admin-accent)",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => setFormColors(formColors.filter((x) => x !== c))}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--admin-accent)",
                          cursor: "pointer",
                          padding: 0,
                          fontSize: 14,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Size Options */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--admin-border)",
              background: "var(--admin-bg-subtle)",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--admin-text)",
              }}
            >
              <input
                type="checkbox"
                checked={formShowSizeOption}
                onChange={(e) => setFormShowSizeOption(e.target.checked)}
                style={{ accentColor: "var(--admin-accent)" }}
              />
              <Ruler size={14} style={{ color: "var(--admin-accent)" }} />
              Enable Size Options
            </label>

            {formShowSizeOption && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    className="admin-input"
                    style={{ height: 36, fontSize: 12 }}
                    placeholder="Size (e.g. S, M, L, XL)"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="admin-btn-primary"
                    style={{ height: 36, padding: "0 12px", fontSize: 12, borderRadius: 8, flexShrink: 0 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {formSizes.map((s) => (
                    <span
                      key={s}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "var(--admin-accent-muted)",
                        color: "var(--admin-accent)",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => setFormSizes(formSizes.filter((x) => x !== s))}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--admin-accent)",
                          cursor: "pointer",
                          padding: 0,
                          fontSize: 14,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="admin-btn-primary"
            style={{ width: "100%", height: 48, fontSize: 15, borderRadius: 14, marginTop: 8 }}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="admin-animate-spin" />
                Saving…
              </>
            ) : editingProduct ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>
        </form>
      </BottomDrawer>
    </div>
  );
};

export default AdminProducts;
