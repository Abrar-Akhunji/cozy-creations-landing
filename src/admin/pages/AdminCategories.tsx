import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { FirestoreCategory } from "@/context/ProductContext";
import BottomDrawer from "../components/BottomDrawer";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreCategory | null>(null);

  // Form
  const [formName, setFormName] = useState("");
  const [formEmoji, setFormEmoji] = useState("");
  const [saving, setSaving] = useState(false);

  // Realtime listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FirestoreCategory);
      setCategories(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Open add
  const openAdd = () => {
    setEditing(null);
    setFormName("");
    setFormEmoji("🧶");
    setDrawerOpen(true);
  };

  // Open edit
  const openEdit = (c: FirestoreCategory) => {
    setEditing(c);
    setFormName(c.name);
    setFormEmoji(c.emoji);
    setDrawerOpen(true);
  };

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: formName.trim(),
        emoji: formEmoji.trim() || "📦",
      };
      if (editing) {
        await updateDoc(doc(db, "categories", editing.id), data);
      } else {
        await addDoc(collection(db, "categories"), data);
      }
      setDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Emoji presets
  const emojiPresets = ["🧶", "🎩", "👜", "🧸", "🏡", "🧣", "🎀", "🌸", "✨", "🪡", "🧤", "🎁"];

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: "80px 0" }}>
        <Loader2 size={28} className="admin-animate-spin" style={{ color: "var(--admin-accent)" }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
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
            Categories
          </h2>
          <p style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"} defined
          </p>
        </div>
        <button onClick={openAdd} className="admin-btn-primary" style={{ height: 38, fontSize: 13, borderRadius: 10 }}>
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* Category Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {categories.map((c, idx) => (
          <div
            key={c.id}
            className="admin-card admin-animate-fade-in-up"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              animationDelay: `${idx * 50}ms`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Emoji Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--admin-accent-muted)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {c.emoji}
              </div>
              <div>
                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--admin-text)",
                  }}
                >
                  {c.name}
                </h4>
                <p style={{ fontSize: 11, color: "var(--admin-text-muted)", margin: "2px 0 0" }}>
                  ID: {c.id.slice(0, 8)}…
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => openEdit(c)}
                className="admin-btn-ghost"
                style={{ height: 32, width: 32, padding: 0, borderRadius: 8 }}
                aria-label="Edit category"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="admin-btn-danger"
                style={{ height: 32, width: 32, padding: 0, borderRadius: 8 }}
                aria-label="Delete category"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--admin-text-muted)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>🏷️</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>No categories yet</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            Tap "Add New" to create your first category.
          </p>
        </div>
      )}

      {/* Add/Edit Bottom Drawer */}
      <BottomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            <label className="admin-label">Category Name</label>
            <input
              className="admin-input"
              placeholder="e.g. Sweaters & Cardigans"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="admin-label">Category Emoji / Icon</label>
            <input
              className="admin-input"
              placeholder="🧶"
              value={formEmoji}
              onChange={(e) => setFormEmoji(e.target.value)}
              style={{ fontSize: 18, textAlign: "center" }}
            />

            {/* Quick Emoji Presets */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10,
              }}
            >
              {emojiPresets.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormEmoji(emoji)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: formEmoji === emoji ? "2px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                    background: formEmoji === emoji ? "var(--admin-accent-muted)" : "var(--admin-bg-subtle)",
                    fontSize: 20,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid var(--admin-border)",
              background: "var(--admin-bg-subtle)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 24 }}>{formEmoji || "📦"}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-text)" }}>
              {formName || "Category Preview"}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="admin-btn-primary"
            style={{ width: "100%", height: 48, fontSize: 15, borderRadius: 14 }}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="admin-animate-spin" />
                Saving…
              </>
            ) : editing ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </button>
        </form>
      </BottomDrawer>
    </div>
  );
};

export default AdminCategories;
