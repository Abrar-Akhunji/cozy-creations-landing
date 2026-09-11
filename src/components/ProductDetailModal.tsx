import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Zap, Check, ChevronDown, ChevronUp } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_COLORS = [
  { name: "Cream White", hex: "#F3EBDD" },
  { name: "Sage Green", hex: "#8D9B82" },
  { name: "Azure Blue", hex: "#4B7095" },
  { name: "Rose Pink", hex: "#D4A3A9" },
  { name: "Earthy Beige", hex: "#C4A484" }
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  // Dynamic sizes based on category
  const getSizesForCategory = (category: string) => {
    if (category === "Sweaters & Cardigans") {
      return ["S", "M", "L", "XL"];
    }
    if (category === "Beanies & Hats") {
      return ["Kids", "Adults", "Slouchy"];
    }
    return ["Standard"];
  };

  // Determine dynamic sizes list based on product specifications
  const sizes = React.useMemo(() => {
    if (!product) return ["Standard"];
    if (product.sizes && product.sizes.length > 0) return product.sizes;
    return getSizesForCategory(product.category);
  }, [product]);

  // Determine dynamic colors list based on product specifications
  const colors = React.useMemo(() => {
    if (!product) return [];
    if (product.colors && product.colors.length > 0) {
      return product.colors.map(c => {
        if (typeof c === "string") {
          const parts = c.split("|");
          return { name: parts[0], hex: parts[1] || parts[0] };
        }
        return c as { name: string; hex: string };
      });
    }
    return DEFAULT_COLORS;
  }, [product]);
  
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "Standard");
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "");

  // Reset local state when product changes
  React.useEffect(() => {
    if (product) {
      const dynamicSizes = product.sizes && product.sizes.length > 0
        ? product.sizes
        : getSizesForCategory(product.category);
      
      const dynamicColors = product.colors && product.colors.length > 0
        ? product.colors.map(c => typeof c === "string" ? c.split("|")[0] : c.name)
        : DEFAULT_COLORS.map(c => c.name);

      setSelectedSize(dynamicSizes[0] || "Standard");
      setSelectedColor(dynamicColors[0] || "");
      setQuantity(1);
      setIsDescExpanded(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    const sizeVal = product.showSizeOption !== false ? selectedSize : undefined;
    const colorVal = product.showColorOption !== false ? selectedColor : undefined;
    
    addToCart(product, quantity, sizeVal, colorVal);
    
    const details = [
      sizeVal ? `Size: ${sizeVal}` : null,
      colorVal ? `Color: ${colorVal}` : null
    ].filter(Boolean).join(" | ");

    toast.success(`${product.name} added to cart!`, {
      description: `${quantity}x${details ? ` | ${details}` : ""}`,
      action: {
        label: "View Cart",
        onClick: () => {
          navigate("/cart");
        }
      }
    });
    onClose();
  };

  const handleBuyNow = () => {
    const sizeVal = product.showSizeOption !== false ? selectedSize : undefined;
    const colorVal = product.showColorOption !== false ? selectedColor : undefined;
    
    addToCart(product, quantity, sizeVal, colorVal);
    onClose();
    navigate("/cart");
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const isLongDescription = (product.description || "").length > 140;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-3rem)] md:w-full max-w-4xl h-[90dvh] md:h-[620px] max-h-[92dvh] md:max-h-[85vh] p-0 gap-0 rounded-3xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-[1.1fr_1fr]">
        {/* Left Column - Product Image */}
        <div className="relative w-full h-44 sm:h-52 md:h-full bg-card border-b md:border-b-0 md:border-r border-border shrink-0 overflow-hidden">
          <img
            src={optimizeCloudinaryUrl(product.image, 800)}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
          {/* Category Badge on mobile */}
          <div className="absolute bottom-3 left-3 md:hidden bg-background/90 backdrop-blur-md border border-border px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
            {product.category}
          </div>
        </div>

        {/* Right Column - Product Details & Fixed Actions */}
        <div className="flex flex-col h-full min-h-0 overflow-hidden bg-background">
          {/* Scrollable details container */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-4">
            <DialogHeader className="text-left space-y-1 p-0">
              <span className="hidden md:inline-block text-xs text-primary font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight font-serif-luxury text-[#2E2A26]">
                {product.name}
              </DialogTitle>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </div>
            </DialogHeader>

            {/* Description with clean line-clamp and read-more toggle */}
            <div className="space-y-1">
              <DialogDescription
                className={`text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${
                  !isDescExpanded ? "line-clamp-3 sm:line-clamp-4" : ""
                }`}
              >
                {product.description}
              </DialogDescription>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 transition-colors pt-0.5"
                >
                  {isDescExpanded ? (
                    <>Show less <ChevronUp className="size-3" /></>
                  ) : (
                    <>Read full details &amp; features <ChevronDown className="size-3" /></>
                  )}
                </button>
              )}
            </div>

            {/* Color Picker */}
            {product.showColorOption !== false && colors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Color
                  </span>
                  <span className="font-medium text-foreground">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative size-8 sm:size-9 rounded-full border border-black/15 shadow-sm transition-all flex items-center justify-center ${
                          isSelected
                            ? "scale-110 ring-2 ring-primary ring-offset-2"
                            : "hover:scale-105 opacity-85 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        type="button"
                        aria-label={c.name}
                        aria-pressed={isSelected}
                      >
                        {isSelected && (
                          <Check className="size-3.5 text-foreground drop-shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.showSizeOption !== false && sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm font-medium rounded-full border transition-all ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground shadow-sm"
                            : "border-border bg-card hover:bg-accent/40 text-foreground"
                        }`}
                        type="button"
                        aria-pressed={isSelected}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Quantity</span>
              <div className="rounded-full border border-border bg-card px-2 h-9 sm:h-10 flex items-center gap-3">
                <button
                  onClick={decrementQty}
                  className="w-7 h-7 rounded-full bg-background hover:bg-accent flex items-center justify-center transition-colors text-foreground"
                  type="button"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={incrementQty}
                  className="w-7 h-7 rounded-full bg-background hover:bg-accent flex items-center justify-center transition-colors text-foreground"
                  type="button"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Fixed Action Buttons at the bottom of the modal */}
          <div className="p-4 sm:p-6 pt-3 border-t border-border bg-background/98 backdrop-blur-md space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="h-11 sm:h-12 rounded-full border border-primary/30 bg-primary/10 text-primary font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-primary/20 active:scale-[0.98] transition-all"
                type="button"
              >
                <ShoppingBag className="size-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="h-11 sm:h-12 rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-primary-hover active:scale-[0.98] transition-all shadow-md"
                type="button"
              >
                <Zap className="size-4 fill-current" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
