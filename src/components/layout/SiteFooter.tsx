import { Link } from "react-router-dom";
import { Phone, Mail, Instagram, ArrowUp, Heart, Sparkles } from "lucide-react";

const SiteFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[#E1D6C8] bg-[#F3EBDD]/40 text-[#2E2A26] overflow-hidden">
      {/* Background organic shape accent */}
      <div className="absolute -bottom-20 -left-20 size-[300px] bg-primary/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand details */}
          <div className="space-y-6 text-left">
            <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <img
                  src="/thlogo.png"
                  alt="Twin Hooks Logo"
                  className="h-24 w-auto rounded-xl border border-[#E1D6C8]/60 bg-white px-2 py-1 shadow-sm object-contain"
                />
                <div>
                  <span className="font-bold text-xl tracking-tight font-serif-luxury block leading-none text-[#2E2A26]">
                    Twin Hooks
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#7A6F66] font-bold block mt-1.5">
                    Artisanal Crochet
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-[#7A6F66] font-sans-modern font-light leading-relaxed max-w-xs">
              Crafting slow, sustainable luxury. Hand-stitched with premium natural fibers, designed to carry warmth and comfort for a lifetime.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary font-sans-modern">
              <Sparkles className="size-3.5 animate-pulse" />
              <span>100% Handcrafted in India</span>
            </div>
          </div>

          {/* Column 2: Explore links */}
          <div className="space-y-4 text-left">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#2E2A26]/50 font-sans-modern">
              Explore Atelier
            </h3>
            <ul className="space-y-2.5 text-sm font-sans-modern font-light">
              <li>
                <Link className="text-[#7A6F66] hover:text-primary transition-colors flex items-center gap-1.5 group" to="/shop">
                  <span className="size-1 rounded-full bg-[#7A6F66]/30 group-hover:bg-primary transition-colors" />
                  Shop Creations
                </Link>
              </li>
              <li>
                <Link className="text-[#7A6F66] hover:text-primary transition-colors flex items-center gap-1.5 group" to="/gallery">
                  <span className="size-1 rounded-full bg-[#7A6F66]/30 group-hover:bg-primary transition-colors" />
                  Atelier Gallery
                </Link>
              </li>
              <li>
                <Link className="text-[#7A6F66] hover:text-primary transition-colors flex items-center gap-1.5 group" to="/about">
                  <span className="size-1 rounded-full bg-[#7A6F66]/30 group-hover:bg-primary transition-colors" />
                  Our Story
                </Link>
              </li>
              <li>
                <Link className="text-[#7A6F66] hover:text-primary transition-colors flex items-center gap-1.5 group" to="/contact">
                  <span className="size-1 rounded-full bg-[#7A6F66]/30 group-hover:bg-primary transition-colors" />
                  Custom Commissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Channels */}
          <div className="space-y-4 text-left">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#2E2A26]/50 font-sans-modern">
              Get in Touch
            </h3>
            <ul className="space-y-3.5 text-sm font-sans-modern font-light">
              <li>
                <a 
                  href="https://wa.me/919586030292" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#7A6F66] hover:text-primary transition-colors flex items-center gap-2.5 group"
                >
                  <Phone className="size-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span>+91 9586030292</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:twinhooks.art@gmail.com" 
                  className="text-[#7A6F66] hover:text-primary transition-colors flex items-center gap-2.5 group"
                >
                  <Mail className="size-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span className="break-all">twinhooks.art@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/twinhooks.art" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#7A6F66] hover:text-primary transition-colors flex items-center gap-2.5 group"
                >
                  <Instagram className="size-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span>@twinhooks.art</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Conscious Statement & Details */}
          <div className="space-y-5 text-left">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#2E2A26]/50 font-sans-modern">
              Conscious Craft
            </h3>
            <div className="p-4.5 rounded-2xl border border-[#E1D6C8] bg-white/40 space-y-3">
              <p className="text-xs text-[#7A6F66] font-sans-modern font-light leading-relaxed">
                Every purchase supports slow fashion, ethical labor, and traditional artisans. We weave heirloom quality pieces meant to pass down generations.
              </p>
              <div className="flex gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  Organic Yarns
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  Zero Waste
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider & Bottom copyright layout */}
        <div className="mt-14 pt-8 border-t border-[#E1D6C8]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-muted-foreground font-sans-modern font-light">
            <p>© {new Date().getFullYear()} Twin Hooks Crochet. All rights reserved.</p>
            <span className="hidden sm:inline text-[#E1D6C8]/60">|</span>
            <p className="flex items-center gap-1">
              Made with <Heart className="size-3 text-primary fill-primary animate-pulse mx-0.5" /> by{" "}
              <a
                href="https://firehox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline transition-all"
              >
                Firehox
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground font-sans-modern font-light">
            <Link className="hover:text-primary transition-colors" to="/contact">
              Privacy Policy
            </Link>
            <Link className="hover:text-primary transition-colors" to="/contact">
              Terms of Service
            </Link>
            
            {/* Scroll to top button */}
            <button
              onClick={scrollToTop}
              className="size-9 rounded-full border border-[#E1D6C8] bg-white flex items-center justify-center text-primary shadow-sm hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md"
              title="Scroll to Top"
              type="button"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default SiteFooter;