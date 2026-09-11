import { useState, useMemo } from "react";
import { useProducts } from "@/context/ProductContext";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Product } from "@/data/products";

const Gallery = () => {
  const { products, categories, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Works");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Category selection options
  const chips = useMemo(() => {
    return ["All Works", ...categories.map(c => c.name)];
  }, [categories]);

  // Gallery items pulled from live products
  const items = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      if (selectedCategory === "All Works") return true;
      return p.category === selectedCategory;
    });
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <header className="text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" /> Finished Creations
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
          The Art of the Stitch
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
          Every loop tells a story of patience, art, and craft. Explore high-resolution details of our custom work and standard atelier catalog.
        </p>
        
        {/* Category Filter Chips */}
        {chips.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {chips.map((c) => {
              const isActive = selectedCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`h-10 px-5 rounded-full border text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-sm scale-[1.02]"
                      : "bg-card border-border text-foreground/75 hover:border-primary/60 hover:text-foreground"
                  }`}
                  type="button"
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Masonry Columns */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-card/40 border border-dashed border-border rounded-3xl max-w-lg mx-auto">
          <p className="text-2xl mb-2">📸</p>
          <p className="text-base font-medium text-foreground">No gallery images in this section yet</p>
          <p className="text-xs text-muted-foreground mt-1">Our administrator hasn't added any products to this category yet.</p>
        </div>
      ) : (
        <section className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] animate-in fade-in duration-500">
          {items.map((it) => (
            <article
              key={it.id}
              onClick={() => {
                setSelectedProduct(it);
                setIsDetailOpen(true);
              }}
              className="group block mb-6 break-inside-avoid rounded-3xl overflow-hidden border border-border bg-card shadow-card hover:shadow-hover transition-all duration-300 relative cursor-pointer"
            >
              <img
                src={optimizeCloudinaryUrl(it.image, 600)}
                alt={it.name}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary">{it.category}</span>
                  <h4 className="text-white font-bold font-serif-luxury text-base mt-0.5">{it.name}</h4>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">₹{(it.price || 0).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </article>
          ))}

          {/* Testimonial Quote Card in masonry */}
          <article className="mb-6 break-inside-avoid rounded-3xl border border-border bg-primary/5 p-8 shadow-card text-left space-y-4">
            <span className="text-4xl text-primary font-serif leading-none block">“</span>
            <p className="text-lg font-serif-luxury text-[#2E2A26] leading-relaxed">
              The attention to detail in the stitches is simply breathtaking. It’s not just a product—it feels like wearable, sustainable art.
            </p>
            <div className="border-t border-border/40 pt-3">
              <p className="text-xs font-bold text-foreground">Elena R.</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Verified Buyer • custom cardigan</p>
            </div>
          </article>
        </section>
      )}

      {items.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link
            to="/shop"
            className="h-12 px-8 inline-flex items-center rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Visit the Storefront
          </Link>
        </div>
      )}

      {/* Selected Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Gallery;
