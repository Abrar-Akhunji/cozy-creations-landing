import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Award, Loader2 } from "lucide-react";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { useProducts } from "@/context/ProductContext";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Product } from "@/data/products";

const Home = () => {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const whatsappUrl = createWhatsAppUrl(
    "Hi! I'd like to know more about TwinHooks crochet products."
  );

  // Auto Image Slider for Hero Section
  const heroImages = [
    "/hero-sec-image1.jpeg",
    "/hero-sec-image2.jpeg",
    "/hero-sec-image3.jpeg",
    "/hero-sec-image4.jpeg"
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Live Curated Gallery (up to 3 products)
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    return products.slice(0, 3);
  }, [products]);

  return (
    <div className="space-y-24 pb-12">
      {/* HERO SECTION */}
      <section className="relative min-h-[75vh] grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center pt-8">
        
        {/* Left Copy Column */}
        <div className="space-y-8 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary animate-fade-in">
            <Sparkles className="size-3.5" /> Premium Handcrafted Crochet
          </div>
          
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.05] font-serif-luxury text-[#2E2A26]">
            Handcrafted <span className="italic text-primary">Warmth</span>
            <br />
            &amp; Sustainable Luxury
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Thoughtfully stitched in India using pure natural fibers, our creations are heirloom-quality statements made to measure for your unique lifestyle.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/shop"
              className="h-12 px-8 inline-flex items-center rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Shop Collection <ArrowRight className="ml-2.5 size-4.5" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="h-12 px-8 inline-flex items-center rounded-full bg-card border border-border font-semibold hover:bg-accent/40 shadow-sm transition-all active:scale-[0.98]"
            >
              Request Custom Order
            </a>
          </div>
        </div>

        {/* Right Slider Column */}
        <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[32px] overflow-hidden border border-border bg-card shadow-card group">
          {heroImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Crochet Creation ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              loading="lazy"
            />
          ))}
          
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Slider Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-6 bg-primary" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="space-y-12">
        <header className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
            The TwinHooks Standard
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            We value the art of slow fashion—where every item is meticulously crafted to be personal, durable, and clean.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Natural Yarns",
              desc: "Eco-friendly, sustainable cottons and wools with an ultra-soft finish.",
              icon: <Sparkles className="size-5.5 text-primary" />,
            },
            {
              title: "Tailored to Order",
              desc: "Select colors, specific measurements, and features designed for you.",
              icon: <Heart className="size-5.5 text-primary" />,
            },
            {
              title: "Artisan Quality",
              desc: "Precision lock-stitches and reinforced seams meant to last generations.",
              icon: <Award className="size-5.5 text-primary" />,
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-left space-y-4"
            >
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold font-serif-luxury text-[#2E2A26]">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 text-left order-2 lg:order-1">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
            Our Story
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            Born from a deep love for tactile crafts and sustainable design, TwinHooks represents slow lifestyle choices. Every single loop is handcrafted with precision, bringing you unique knitwear that tells a story of patience, art, and passion.
          </p>
          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Discover our atelier <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative rounded-[32px] overflow-hidden border border-border bg-card aspect-[4/3] shadow-card order-1 lg:order-2">
          <img
            src="/butterflly.jpg"
            alt="Handcrafted crochet pattern"
            className="absolute inset-0 w-full h-full object-cover hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </section>

      {/* CURATED LIVE GALLERY */}
      {featuredProducts.length > 0 && (
        <section className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-left">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
                Curated Shop Pieces
              </h2>
              <p className="text-muted-foreground text-base">
                Discover the latest artisan hand-woven additions to the catalog.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Browse Shop Catalog <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((p) => (
                <article
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setIsDetailOpen(true);
                  }}
                  className="group rounded-3xl border border-border bg-card overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden bg-background">
                    <img
                      src={optimizeCloudinaryUrl(p.image, 500)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 space-y-2 text-left border-t border-border/50">
                    <span className="text-[10px] text-primary font-extrabold uppercase tracking-wider">
                      {p.category}
                    </span>
                    <h3 className="font-semibold text-lg text-[#2E2A26] line-clamp-1">{p.name}</h3>
                    <p className="text-sm font-bold text-muted-foreground">
                      ₹{(p.price || 0).toLocaleString("en-IN")}
                    </p>
                    <div className="text-xs font-medium text-primary pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View details &amp; buy &rarr;
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
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

export default Home;

