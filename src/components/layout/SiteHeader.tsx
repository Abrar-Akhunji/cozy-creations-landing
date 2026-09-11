import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { UserProfileDrawer } from "@/components/UserProfileDrawer";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-medium transition-colors",
    isActive ? "text-primary" : "text-foreground/80 hover:text-primary",
  ].join(" ");

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-base font-semibold py-3 px-4 rounded-2xl transition-all flex items-center justify-between",
    isActive
      ? "bg-primary/10 text-primary font-bold"
      : "text-foreground/80 hover:bg-accent hover:text-foreground",
  ].join(" ");

const SiteHeader = () => {
  const { itemCount } = useCart();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-content px-4 sm:px-6 md:px-12 h-16 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden size-10 rounded-full bg-card border border-border grid place-items-center hover:shadow-card transition-shadow text-[#2E2A26]"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link to="/" className="flex items-center -my-4 sm:-my-6 transition-transform hover:scale-[1.02]">
              <img
                src="/thlogo.png"
                alt="Twin Hooks Logo"
                className="h-24 sm:h-28 md:h-32 w-auto object-contain"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/gallery" className={navLinkClass}>
              Gallery
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="size-10 rounded-full bg-card border border-border grid place-items-center hover:shadow-card transition-shadow text-[#2E2A26]"
              aria-label="Open customer profile"
              aria-expanded={isProfileOpen}
              type="button"
            >
              <User className="size-5" />
            </button>

            <Link
              to="/cart"
              className="relative size-10 rounded-full bg-card border border-border grid place-items-center hover:shadow-card transition-shadow text-[#2E2A26]"
              aria-label="Cart"
            >
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-xl px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <NavLink
              to="/shop"
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>🛍️ Shop Collection</span>
            </NavLink>
            <NavLink
              to="/gallery"
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>✨ Atelier Gallery</span>
            </NavLink>
            <NavLink
              to="/about"
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>🧵 About Twin Hooks</span>
            </NavLink>
            <NavLink
              to="/contact"
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>💌 Contact &amp; Custom Orders</span>
            </NavLink>
          </div>
        )}
      </header>

      {/* Profile drawer renders outside the header via React Portal */}
      <UserProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default SiteHeader;
