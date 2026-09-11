import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { Product } from "@/data/products";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { Search, SlidersHorizontal, ChevronDown, RefreshCw, X, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const { products, categories, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortOption, setSortOption] = useState("featured");

  // Selected product state for modal detail view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Generate category emoji map dynamically from categories
  const categoryEmojiMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach(c => {
      map[c.name] = c.emoji;
    });
    return map;
  }, [categories]);

  // Sync URL search parameters if changed from external source (like Gallery page click)
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams, searchQuery]);

  // Auto-open product detail modal if 'product' or direct link is provided
  useEffect(() => {
    const prodParam = searchParams.get("product");
    if (prodParam && products && products.length > 0) {
      const match = products.find(
        (p) => p.id === prodParam || p.name.toLowerCase() === prodParam.toLowerCase()
      );
      if (match) {
        setSelectedProduct(match);
        setIsDetailOpen(true);
      }
    }
  }, [searchParams, products]);

  // Clean query param on reset
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setMaxPrice(2500);
    setSortOption("featured");
    setCurrentPage(1);
    setSearchParams({});
  };

  /**
   * Jump to a category: clears all other filters, applies this single category.
   * If the same category is clicked again, it deselects (toggle).
   */
  const handleCategoryJump = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      // Reset other filters on jump for a clean focused experience
      setSearchQuery("");
      setMaxPrice(2500);
      setSortOption("featured");
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((p) => {
        if (!p) return false;
        // Category filter
        if (selectedCategory && p.category !== selectedCategory) {
          return false;
        }
        // Price filter
        const price = p.price !== undefined && p.price !== null ? p.price : 0;
        if (price > maxPrice) {
          return false;
        }
        // Search query filter
        if (searchQuery) {
          const nameMatch = p.name ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
          const descMatch = p.description ? p.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
          if (!nameMatch && !descMatch) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        const priceA = a.price !== undefined && a.price !== null ? a.price : 0;
        const priceB = b.price !== undefined && b.price !== null ? b.price : 0;
        if (sortOption === "price-low") {
          return priceA - priceB;
        }
        if (sortOption === "price-high") {
          return priceB - priceA;
        }
        // Default 'featured' sorting (by ID numeric value)
        const idA = parseInt((a.id || "").replace("p", "")) || 0;
        const idB = parseInt((b.id || "").replace("p", "")) || 0;
        return idA - idB;
      });
  }, [products, selectedCategory, searchQuery, maxPrice, sortOption]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const hasActiveFilters = selectedCategory || searchQuery || maxPrice < 2500;

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Crochet Shop...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Crochet Shop</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse ready-made crochet wonders and customizable items, handcrafted to perfection.
        </p>
      </header>

      {/* Category Quick-Jump Pills */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Jump to category
        </p>
        <div className="flex gap-2 flex-wrap">
          {/* "All" pill */}
          <button
            onClick={handleResetFilters}
            className={`inline-flex items-center gap-1.5 px-4 h-10 rounded-full border text-sm font-medium transition-all duration-200 ${
              !selectedCategory
                ? "bg-primary border-primary text-primary-foreground shadow-sm scale-[1.02]"
                : "bg-card border-border text-foreground/70 hover:border-primary/60 hover:text-foreground"
            }`}
            type="button"
            aria-pressed={!selectedCategory}
          >
            ✨ All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryJump(cat.name)}
              className={`inline-flex items-center gap-1.5 px-4 h-10 rounded-full border text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.name
                  ? "bg-primary border-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "bg-card border-border text-foreground/70 hover:border-primary/60 hover:text-foreground"
              }`}
              type="button"
              aria-pressed={selectedCategory === cat.name}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active filter badge */}
      {selectedCategory && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Showing:</span>
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full">
            {categoryEmojiMap[selectedCategory]} {selectedCategory}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className="ml-0.5 hover:text-primary/60 transition-colors"
              aria-label="Remove category filter"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Control Bar (Search + Sort) */}
      <div className="grid sm:grid-cols-[1fr_auto] gap-4">
        {/* Search */}
        <div className="flex items-center gap-3 rounded-full bg-card border border-border px-4 h-12 shadow-sm w-full sm:max-w-md">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
            placeholder="Search cozy sweaters, tote bags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
                setSearchParams({});
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              type="button"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative shrink-0 select-none">
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-[200px] h-12 pl-4 pr-10 rounded-full border border-border bg-card text-sm font-medium shadow-sm outline-none appearance-none cursor-pointer"
            aria-label="Sort products"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" /> Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                type="button"
              >
                <RefreshCw className="size-3" /> Reset All
              </button>
            )}
          </div>

          <hr className="border-border" />

          {/* Category Filter — single-select, jump behaviour */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryJump(cat.name)}
                    type="button"
                    className={`w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="text-base leading-none">{cat.emoji}</span>
                    <span className="flex-1">{cat.name}</span>
                    {isActive && <X className="size-3.5 text-primary/70 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-border" />

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Price Limit
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="299"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-primary cursor-pointer"
                aria-label="Price filter"
              />
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>₹299</span>
                <span className="text-primary text-sm font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  Under ₹{maxPrice.toLocaleString("en-IN")}
                </span>
                <span>₹2,500</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
              {selectedCategory ? (
                <>
                  items in{" "}
                  <span className="text-primary font-semibold">{selectedCategory}</span>
                </>
              ) : (
                "items found"
              )}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-card/40 border border-dashed border-border rounded-3xl space-y-3">
              {products.length === 0 ? (
                <>
                  <p className="text-2xl">🧶</p>
                  <p className="text-lg font-medium text-foreground">New collection coming soon!</p>
                  <p className="text-sm text-muted-foreground">Our handcrafted pieces are being prepared. Check back soon!</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-foreground">No products found matching filters</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 h-11 bg-primary text-primary-foreground font-medium rounded-full shadow-sm hover:opacity-95"
                    type="button"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>

          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((p) => (
                <article
                  key={p.id}
                  onClick={() => handleProductClick(p)}
                  className="group rounded-3xl border border-border bg-card overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Square Image Container */}
                  <div className="aspect-square relative w-full overflow-hidden bg-background border-b border-border">
                    <img
                      src={optimizeCloudinaryUrl(p.image, 600)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-border px-3 py-1 rounded-full text-xs font-bold text-primary">
                      ₹{(p.price || 0).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryJump(p.category);
                        }}
                        className="text-[10px] text-primary font-bold uppercase tracking-wider hover:underline"
                        type="button"
                      >
                        {categoryEmojiMap[p.category] || "✨"} {p.category}
                      </button>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-primary pt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View details &amp; buy &rarr;
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-10 rounded-full border text-sm font-semibold transition-all ${
                    currentPage === page
                      ? "bg-primary border-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                  type="button"
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Selected Product Detail Dialog */}
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

export default Shop;
