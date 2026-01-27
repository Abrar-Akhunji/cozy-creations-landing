import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import heroYarnBg from "@/assets/hero-yarn-bg.jpg";
import knittedAccessories from "@/assets/knitted-accessories.jpg";
import WaveDivider from "./WaveDivider";

const Hero = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.4; // Subtle parallax speed
        parallaxRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappNumber = "919586030292";
  const whatsappMessage = "Hello! I'm interested in your handmade crochet products.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Parallax Background */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 -z-10 will-change-transform"
        style={{
          backgroundImage: `linear-gradient(rgba(251, 248, 244, 0.85), rgba(251, 248, 244, 0.85)), url(${heroYarnBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "120%",
          top: "-10%",
        }}
      />

      <div className="max-w-content mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              TwinHooks
              <br />
              Knitted Products
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Made with love
            </p>
          </div>

          <p className="text-lg text-foreground/80 max-w-xl">
            Every stitch tells a story of dedication and craftsmanship. Discover
            unique, handcrafted crochet pieces that bring warmth and elegance to
            your wardrobe.
          </p>

          <Button
            asChild
            size="lg"
            className="rounded-full text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-hover"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Contact me
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-hover transform hover:scale-105 transition-transform duration-500">
            <img
              src={knittedAccessories}
              alt="Handmade knitted hat and accessories"
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-full opacity-50 blur-2xl -z-10" />
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/30 rounded-full opacity-50 blur-3xl -z-10" />
        </div>
      </div>

      {/* Wave Divider */}
      <WaveDivider />
    </section>
  );
};

export default Hero;