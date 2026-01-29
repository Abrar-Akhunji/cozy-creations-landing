import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Search, User } from "lucide-react";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-medium transition-colors",
    isActive ? "text-primary" : "text-foreground/80 hover:text-primary",
  ].join(" ");

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-content px-6 md:px-12 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-primary font-semibold tracking-tight">TH</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">TwinHooks</span>
        </Link>

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
          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-card border border-border px-4 h-10 w-[320px]">
            <Search className="size-4 text-muted-foreground" />
            <input
              className="bg-transparent outline-none w-full text-sm"
              placeholder="Search patterns, yarns…"
              aria-label="Search"
            />
          </div>

          <Link
            to="/cart"
            className="size-10 rounded-full bg-card border border-border grid place-items-center hover:shadow-card transition-shadow"
            aria-label="Cart"
          >
            <ShoppingCart className="size-5" />
          </Link>
          <button
            className="size-10 rounded-full bg-card border border-border grid place-items-center hover:shadow-card transition-shadow"
            aria-label="Account"
            type="button"
          >
            <User className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
