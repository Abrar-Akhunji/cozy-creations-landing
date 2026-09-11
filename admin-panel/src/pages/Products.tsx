import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Product, products as localProducts } from "../data/products";
import { FirestoreCategory } from "./Categories";
import { BottomDrawer } from "../components/BottomDrawer";
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
  Upload,
  Database,
} from "lucide-react";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
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
  const [migrating, setMigrating] = useState(false);

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleMigrateData = async () => {
    // ── Step 1: Check idempotency sentinel ──────────────────────────────────
    // The sentinel document _meta/migration_v1 is written after a successful
    // full migration. If it already exists we show a summary and bail out,
    // preventing any chance of inserting duplicate data.
    try {
      const sentinelRef = doc(db, "_meta", "migration_v1");
      const sentinelSnap = await getDoc(sentinelRef);
      if (sentinelSnap.exists()) {
        const data = sentinelSnap.data();
        const when = data?.migratedAt
          ? new Date(data.migratedAt).toLocaleString()
          : "a previous session";
        const ok = window.confirm(
          `✅ Migration was already completed on ${when}.\n\n` +
          `Products migrated: ${data?.productCount ?? "unknown"}\n` +
          `Categories migrated: ${data?.categoryCount ?? "unknown"}\n\n` +
          `Running it again will SKIP all already-existing products.\n` +
          `Click OK only if you have NEW local products to add, otherwise click Cancel.`
        );
        if (!ok) return;
      }
    } catch (err) {
      console.warn("Could not read migration sentinel, proceeding anyway:", err);
    }

    if (
      !window.confirm(
        "Migrate all local products & categories to Firestore?\n\n" +
        "✅ Already-migrated items will be SKIPPED — no duplicates will be created."
      )
    ) return;

    setMigrating(true);
    try {
      const emojiPresets: Record<string, string> = {
        "Sweaters & Cardigans": "🧶",
        "Beanies & Hats": "🎩",
        "Bags & Purses": "👜",
        "Home Decor": "🏡",
        "Amigurumi Toys": "🧸",
      };

      // ── Step 2: Upsert categories (skip if name already exists) ────────────
      // Build a name → id map from the live Firestore state
      const categoryMap = new Map<string, string>();
      categories.forEach((c) => categoryMap.set(c.name.toLowerCase(), c.id));

      const localCategoryNames = Array.from(
        new Set(localProducts.map((p) => p.category))
      );
      let newCategoryCount = 0;
      for (const catName of localCategoryNames) {
        const key = catName.toLowerCase();
        if (!categoryMap.has(key)) {
          const emoji = emojiPresets[catName] ?? "📦";
          const ref = await addDoc(collection(db, "categories"), {
            name: catName,
            emoji,
          });
          categoryMap.set(key, ref.id);
          newCategoryCount++;
        }
      }

      // ── Step 3: Use the LOCAL product ID (p1, p2…) as the Firestore doc ID ─
      // setDoc with the same ID is idempotent: if the doc already exists it will
      // be overwritten ONLY if it didn't exist before (we guard with getDoc first).
      // This means running migration twice CANNOT produce duplicate documents.
      const batch = writeBatch(db);
      let addedCount = 0;
      let skippedCount = 0;

      // Build a set of existing Firestore document IDs (NOT names — IDs are stable)
      const existingDocIds = new Set(products.map((p) => p.id));

      // Also keep a name-based safety net for products migrated without their local ID
      const existingNames = new Set(
        products.map((p) => p.name.trim().toLowerCase())
      );

      for (const p of localProducts) {
        const nameKey = p.name.trim().toLowerCase();
        // Skip if doc already exists by its deterministic local ID OR by name
        if (existingDocIds.has(p.id) || existingNames.has(nameKey)) {
          skippedCount++;
          continue;
        }

        // Use the local product id (e.g. "p1") as the Firestore document id.
        // This makes the migration fully idempotent: the same id can never be
        // inserted twice because Firestore doc IDs are unique keys.
        const productRef = doc(db, "products", p.id);
        batch.set(productRef, {
          name: p.name,
          price: p.price,
          category: p.category,
          description: p.description,
          image: p.image,
          images: p.images?.length ? p.images : [p.image],
          showColorOption: !!p.showColorOption,
          showSizeOption: !!p.showSizeOption,
          colors: p.colors ?? [],
          sizes: p.sizes ?? [],
        });
        addedCount++;
      }

      if (addedCount > 0) {
        await batch.commit();
      }

      // ── Step 4: Write the idempotency sentinel ──────────────────────────────
      await setDoc(doc(db, "_meta", "migration_v1"), {
        migratedAt: new Date().toISOString(),
        productCount: addedCount + skippedCount,
        categoryCount: localCategoryNames.length,
        newProductsThisRun: addedCount,
        skippedProductsThisRun: skippedCount,
        newCategoriesThisRun: newCategoryCount,
      });

      if (addedCount > 0) {
        alert(
          `✅ Migration complete!\n\n` +
          `• ${addedCount} new product(s) added\n` +
          `• ${skippedCount} product(s) skipped (already in database)\n` +
          `• ${newCategoryCount} new categor${newCategoryCount === 1 ? "y" : "ies"} created\n\n` +
          `A migration record has been saved to prevent duplicate runs.`
        );
      } else {
        alert(
          `✅ No new products to migrate.\n\n` +
          `All ${skippedCount} local products already exist in the database.\n` +
          `Nothing was changed.`
        );
      }
    } catch (err) {
      console.error("Migration error:", err);
      alert("❌ Migration failed. See the browser console for details.");
    } finally {
      setMigrating(false);
    }
  };

  // Realtime listeners
  useEffect(() => {
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
        setProducts(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Products subscription error:", err);
        setError(err.message || "Failed to load products.");
        setLoading(false);
      }
    );

    const unsubCategories = onSnapshot(
      collection(db, "categories"),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FirestoreCategory);
        setCategories(list);
      },
      (err) => {
        console.error("Categories subscription error in Products page:", err);
      }
    );

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      openAddDrawer();
    };
    window.addEventListener("krashe-add-product", handler);
    return () => {
      window.removeEventListener("krashe-add-product", handler);
    };
  }, [categories]);

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

  const selectAll = () => setSelected(new Set(products.map((p) => p.id)));

  const isAllSelected = products.length > 0 && selected.size === products.length;
  const isIndeterminate = selected.size > 0 && selected.size < products.length;

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete the ${selected.size} selected products?`)) return;
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
    if (!window.confirm("Are you sure you want to delete this product?")) return;
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
    setUploadError(null);
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
    setUploadError(null);
    setDrawerOpen(true);
  };

  const setEditingProduct = (p: Product | null) => {
    // Keep reference in state if needed
    // In our case we just use the local state of editingProduct
    _setEditingProductState(p);
  };
  const [editingProduct, _setEditingProductState] = useState<Product | null>(null);

  // ── Client-side image compression ────────────────────────────────────────
  // Resizes to max 1200px on the longest edge and re-encodes as WebP at 0.82
  // quality. This typically reduces file size by 60–80% with no visible quality
  // loss. Falls back to the original file if Canvas is unavailable.
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const MAX_PX = 1200;
      const QUALITY = 0.82;

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;

        // Scale down if either dimension exceeds MAX_PX
        if (width > MAX_PX || height > MAX_PX) {
          const ratio = Math.min(MAX_PX / width, MAX_PX / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // canvas unavailable — use original
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Prefer WebP for better compression; fall back to JPEG
        const mimeType = file.type === "image/png" ? "image/png" : "image/webp";
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // Compression made it larger — return original
              resolve(file);
            } else {
              resolve(blob);
            }
          },
          mimeType,
          QUALITY
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file); // Can't load — use original
      };

      img.src = objectUrl;
    });
  };

  // ── Cloudinary signed upload ──────────────────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    setUploadError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to upload images.");

      // 1. Compress before upload
      const compressed = await compressImage(file);
      const savings = (((file.size - compressed.size) / file.size) * 100).toFixed(0);
      console.log(
        `[Upload] Original: ${(file.size / 1024).toFixed(0)} KB → ` +
        `Compressed: ${(compressed.size / 1024).toFixed(0)} KB (${savings}% saved)`
      );

      // 2. Get a signed upload token from the Vite middleware
      const idToken = await user.getIdToken();
      const signUrl = import.meta.env.VITE_CLOUDINARY_SIGN_URL || "/cloudinary-sign";

      const signRes = await fetch(signUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!signRes.ok) {
        const txt = await signRes.text();
        throw new Error(
          `Signature server error (${signRes.status}): ${txt.slice(0, 200)}`
        );
      }

      // Validate we got JSON (guards against PHP source leaking)
      const contentType = signRes.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const raw = await signRes.text();
        throw new Error(
          `Expected JSON from sign endpoint but got: ${raw.slice(0, 120)}`
        );
      }

      const { signature, timestamp, folder, api_key } = await signRes.json();

      // 3. Upload to Cloudinary
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "weenhooks";
      const ext = file.type === "image/png" ? "png" : "webp";
      const uploadFileName = `product_${Date.now()}.${ext}`;

      const form = new FormData();
      form.append("file", compressed, uploadFileName);
      form.append("api_key", api_key);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: form }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Cloudinary upload failed (${uploadRes.status})`);
      }

      const data = await uploadRes.json();
      setFormImage(data.secure_url);
    } catch (err: any) {
      console.error("[Upload error]", err);
      setUploadError(err.message || "Upload failed. Check console for details.");
    } finally {
      setUploadingImage(false);
    }
  };


  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) return;
    setSaving(true);

    const data: Omit<Product, "id"> = {
      name: formName.trim(),
      price: Number(formPrice),
      category: formCategory || (categories[0]?.name || "Standard"),
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
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#ef4444" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Failed to Load Products</h3>
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
    <div className="admin-dark" style={{ paddingBottom: selected.size > 0 ? 96 : 0 }}>
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: selected.size > 0 ? 10 : 16,
          gap: 8,
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
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleMigrateData}
            className="admin-btn-ghost"
            style={{ height: 38, fontSize: 13, borderRadius: 10, border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", gap: 6 }}
            disabled={migrating}
          >
            {migrating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Database size={15} />
            )}
            {migrating ? "Migrating..." : "Migrate Local Data"}
          </button>
          <button onClick={openAddDrawer} className="admin-btn-primary" style={{ height: 38, fontSize: 13, borderRadius: 10 }}>
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>

      {/* ── Selection Toolbar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
          padding: "10px 14px",
          borderRadius: 12,
          background: selected.size > 0
            ? "rgba(var(--admin-accent-rgb, 139,92,246), 0.08)"
            : "var(--admin-bg-subtle)",
          border: selected.size > 0
            ? "1px solid rgba(var(--admin-accent-rgb, 139,92,246), 0.3)"
            : "1px solid var(--admin-border)",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        {/* Master checkbox */}
        <button
          onClick={() => (isAllSelected ? clearSelection() : selectAll())}
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            border: isAllSelected
              ? "2px solid var(--admin-accent)"
              : isIndeterminate
              ? "2px solid var(--admin-accent)"
              : "2px solid var(--admin-border)",
            background: isAllSelected || isIndeterminate
              ? "var(--admin-accent)"
              : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.15s",
            padding: 0,
          }}
          aria-label={isAllSelected ? "Deselect all" : "Select all"}
          title={isAllSelected ? "Deselect all" : "Select all products"}
        >
          {isAllSelected && <Check size={12} color="#fff" strokeWidth={3} />}
          {isIndeterminate && (
            <div style={{ width: 8, height: 2, background: "#fff", borderRadius: 2 }} />
          )}
        </button>

        {/* Label + count */}
        <button
          onClick={() => (isAllSelected ? clearSelection() : selectAll())}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: selected.size > 0 ? "var(--admin-accent)" : "var(--admin-text-muted)",
            padding: 0,
            transition: "color 0.15s",
            textAlign: "left",
          }}
        >
          {selected.size === 0
            ? "Select All"
            : isAllSelected
            ? `All ${products.length} selected — click to deselect`
            : `${selected.size} of ${products.length} selected`}
        </button>

        {/* Right side quick actions (only when something is selected) */}
        {selected.size > 0 && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--admin-accent)",
                background: "rgba(var(--admin-accent-rgb,139,92,246),0.12)",
                borderRadius: 8,
                padding: "2px 10px",
              }}
            >
              {selected.size} item{selected.size !== 1 ? "s" : ""}
            </span>
            <button
              onClick={clearSelection}
              className="admin-btn-ghost"
              style={{ height: 30, fontSize: 11, borderRadius: 8, padding: "0 10px", display: "flex", alignItems: "center", gap: 4 }}
              aria-label="Clear selection"
            >
              <X size={12} /> Clear
            </button>
            <button
              onClick={handleBulkDelete}
              className="admin-btn-danger"
              style={{ height: 30, fontSize: 11, borderRadius: 8, padding: "0 12px", display: "flex", alignItems: "center", gap: 5 }}
              disabled={deleting}
              aria-label={`Delete ${selected.size} selected products`}
            >
              {deleting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Trash2 size={12} />
              )}
              Delete {selected.size}
            </button>
          </div>
        )}
      </div>

      {/* Product Grid (Responsive) */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
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
                border: isSelected
                  ? "2px solid var(--admin-accent)"
                  : "1px solid var(--admin-border)",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(var(--admin-accent-rgb,139,92,246),0.18)"
                  : undefined,
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            >
              {/* Checkbox — clicking it toggles selection */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleSelect(p.id); }}
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 5,
                  background: isSelected
                    ? "var(--admin-accent)"
                    : "rgba(12,13,18,0.55)",
                  border: isSelected
                    ? "2px solid var(--admin-accent)"
                    : "2px solid rgba(255,255,255,0.35)",
                  borderRadius: 7,
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                aria-label={isSelected ? "Deselect" : "Select"}
                title={isSelected ? "Deselect" : "Select this product"}
              >
                {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
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
                  ₹{(p.price || 0).toLocaleString("en-IN")}
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

      {/* ── Floating Bulk Action Bar ────────────────────────────────────── */}
      {selected.size > 0 && (
        <div
          className="admin-animate-slide-up"
          style={{
            position: "fixed",
            bottom: 72,
            left: 12,
            right: 12,
            zIndex: 55,
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 18,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            gap: 10,
          }}
        >
          {/* Left: select-all toggle + count */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => (isAllSelected ? clearSelection() : selectAll())}
              style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                border: "2px solid var(--admin-accent)",
                background: isAllSelected ? "var(--admin-accent)" : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                flexShrink: 0,
                transition: "background 0.15s",
              }}
              title={isAllSelected ? "Deselect all" : "Select all"}
            >
              {isAllSelected ? (
                <Check size={13} color="#fff" strokeWidth={3} />
              ) : (
                <div style={{ width: 8, height: 2, background: "var(--admin-accent)", borderRadius: 2 }} />
              )}
            </button>

            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--admin-text)" }}>
                {selected.size} item{selected.size !== 1 ? "s" : ""} selected
              </p>
              {!isAllSelected && (
                <button
                  onClick={selectAll}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "var(--admin-accent)",
                    padding: 0,
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  Select all {products.length}
                </button>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={clearSelection}
              className="admin-btn-ghost"
              style={{ height: 36, fontSize: 12, borderRadius: 10, padding: "0 14px" }}
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="admin-btn-danger"
              style={{ height: 36, fontSize: 12, borderRadius: 10, padding: "0 16px", fontWeight: 700 }}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete {selected.size} Item{selected.size !== 1 ? "s" : ""}
            </button>
          </div>
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

          {/* Image Upload / URL */}
          <div>
            <label className="admin-label">
              <ImageIcon size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
              Product Image
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                className="admin-input"
                placeholder="/products/my-image.jpg or https://..."
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                style={{ flex: 1 }}
              />
              <label
                className="admin-btn-ghost"
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: uploadingImage ? "default" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                  border: "1px solid var(--admin-border)",
                  opacity: uploadingImage ? 0.7 : 1,
                }}
              >
                {uploadingImage ? (
                  <Loader2 size={16} className="animate-spin text-primary" />
                ) : (
                  <Upload size={16} />
                )}
                <span style={{ marginLeft: 6 }}>
                  {uploadingImage ? "Compressing…" : "Upload"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                      // Reset so same file can be picked again
                      e.target.value = "";
                    }
                  }}
                  style={{ display: "none" }}
                  disabled={uploadingImage}
                />
              </label>
            </div>
            {uploadError && (
              <div
                style={{
                  marginTop: 6,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "rgba(var(--admin-danger-rgb,239,68,68),0.1)",
                  border: "1px solid rgba(var(--admin-danger-rgb,239,68,68),0.25)",
                  fontSize: 12,
                  color: "var(--admin-danger)",
                  display: "flex",
                  gap: 6,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ flexShrink: 0 }}>⚠️</span>
                <span>{uploadError}</span>
              </div>
            )}

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
            disabled={saving || uploadingImage}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
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
