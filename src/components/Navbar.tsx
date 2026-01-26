import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl md:text-3xl font-semibold text-foreground hover:text-primary transition-colors"
            style={{ fontFamily: "'Poppins', cursive" }}
          >
            Handmade
          </button>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "Home", id: "home" },
              { label: "Superiority", id: "superiority" },
              { label: "About me", id: "about" },
              { label: "Catalog", id: "catalog" },
              { label: "Contacts", id: "contacts" },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground hover:text-primary transition-colors text-base font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Phone Number */}
          <a
            href="tel:+1234567890"
            className="hidden md:flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">+1 (234) 567-890</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;