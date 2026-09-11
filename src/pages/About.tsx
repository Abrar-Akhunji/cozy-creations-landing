import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Droplet, Handshake, Heart } from "lucide-react";

// Scroll-Reveal utility wrapper
const RevealOnScroll: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = "",
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const About = () => {
  return (
    <div className="relative overflow-hidden pb-12">
      {/* Ambient background glow highlights */}
      <div className="absolute top-10 left-10 size-[300px] md:size-[450px] bg-primary/5 rounded-full filter blur-[100px] animate-pulse-slow pointer-events-none -z-10" />
      <div className="absolute top-[80vh] right-10 size-[350px] md:size-[500px] bg-[#EAD8BC]/15 rounded-full filter blur-[120px] animate-pulse-slow pointer-events-none -z-10" />

      {/* Outer flow wrapper controlling section spacing cleanly */}
      <div className="space-y-16 md:space-y-24">
        
        {/* Section 1: About Editorial Section */}
        <section className="max-w-7xl mx-auto py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Handcrafting Visual & Floating Card */}
            <div className="relative order-2 lg:order-1 animate-fade-in group">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[#E1D6C8] bg-[#F3EBDD] aspect-[4/4.5] shadow-card">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQeSPA-kGuZ5y06K05jpkuOOhL0kKCf1WqyzcuVQ3KrpqdRQbMPddh7Z6oqY5RXRuXw9QzEdSrA3e5yJE_I6_RBy6x2PShEj6oEK5VrxsgX7Bwp92yMpNDPDeT7I01b99W-QcFB2uS-1uvsn7pqDRYl9ZGx2K14wvzbxWLUT5hR6N8SpAzf1ec6--06jaZ3oaXyjPW7oBiNxk8P8sGPO1w26-2WRgywzWXb0faETewUbRUu5yx4u8sTnxl5z7IFLKqMz8Pz7CIfA"
                  alt="Close-up of premium crochet work in progress"
                  className="w-full h-full object-cover transition-transform group-hover:scale-103"
                  style={{ transitionDuration: "6000ms" }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2E2A26]/20 via-transparent to-transparent" />
              </div>
              
              {/* Absolute badge overlay */}
              <div className="absolute -bottom-6 -right-4 bg-[#F3EBDD] border border-[#E1D6C8] p-6 rounded-3xl shadow-card max-w-[280px] hidden md:block transition-all duration-500 hover:scale-[1.02] text-left">
                <p className="font-serif-luxury text-base text-[#2E2A26] italic font-medium leading-relaxed">
                  "Every loop is a deliberate act of patience, focus, and art."
                </p>
              </div>
            </div>

            {/* Right Column: Title, Copy & CTA */}
            <div className="order-1 lg:order-2 space-y-6 md:space-y-8 text-left">
              <span className="inline-flex items-center gap-2 bg-[#EAD8BC]/20 border border-[#EAD8BC]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-muted-foreground font-sans-modern">
                Our Ethos
              </span>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.05] text-[#2E2A26]">
                  The Rhythm of
                  <br />
                  <span className="text-primary italic font-light font-serif-luxury block mt-1">the Hook.</span>
                </h1>
                
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed font-sans-modern font-light">
                  Crochet Shop was born from a desire to return to the tactile. In a world of fast production, we champion the slow, the deliberate, and the beautifully imperfect. Our garments are not just worn; they are experienced.
                </p>
                
                <p className="text-sm sm:text-base text-[#2E2A26]/85 max-w-xl leading-relaxed font-sans-modern font-light">
                  We source only natural, sustainably dyed fibers, believing that true luxury lies in harmony with nature. Our cream-based palette and vibrant rose pink accents are inspired by the raw materials themselves—unbleached cottons and organic botanical dyes.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="#gallery"
                  className="h-12 px-8 inline-flex items-center rounded-full bg-primary text-[#FBF8F4] font-semibold hover:opacity-95 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] font-sans-modern text-sm"
                >
                  Explore the Atelier <ArrowRight className="ml-2 size-4" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Sustainability Group (Wavy full-bleed backdrop) */}
        <RevealOnScroll>
          <div>
            {/* Wave Divider */}
            <div className="w-full h-12 overflow-hidden text-[#F3EBDD]/35 flex items-end -mx-4 sm:-mx-6 md:-mx-12">
              <svg className="w-full h-full fill-current" preserveAspectRatio="none" viewBox="0 0 1200 120">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.3,130.83,121.22,192.61,102.73,235.31,89.92,279.16,71.21,321.39,56.44Z"></path>
              </svg>
            </div>

            {/* Sustainability Section Content */}
            <section className="bg-[#F3EBDD]/35 py-16 px-6 md:px-12 border-y border-[#E1D6C8]/60 -mx-4 sm:-mx-6 md:-mx-12">
              <div className="max-w-7xl mx-auto space-y-12">
                
                <header className="text-center space-y-3 max-w-2xl mx-auto">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-primary font-sans-modern">
                    Ethical Sourcing
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#2E2A26]">
                    Conscious Craft
                  </h2>
                  <p className="text-muted-foreground font-sans-modern font-light text-base leading-relaxed">
                    Our commitment to sustainable luxury is woven into every piece we design.
                  </p>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                  
                  {/* Card 1 */}
                  <div className="bg-[#FBF8F4] p-8 rounded-3xl border border-[#E1D6C8] flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-500 group shadow-sm">
                    <div className="size-16 rounded-full bg-[#EAD8BC]/40 text-primary flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Leaf className="size-8" />
                    </div>
                    <h3 className="text-xl font-medium text-[#2E2A26] font-serif-luxury">Organic Fibers</h3>
                    <p className="text-sm text-muted-foreground font-sans-modern font-light leading-relaxed">
                      We exclusively use 100% organic cotton, pure bamboo, and ethically sourced wools.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#FBF8F4] p-8 rounded-3xl border border-[#E1D6C8] flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-500 group shadow-sm">
                    <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Droplet className="size-8" />
                    </div>
                    <h3 className="text-xl font-medium text-[#2E2A26] font-serif-luxury">Botanical Dyes</h3>
                    <p className="text-sm text-muted-foreground font-sans-modern font-light leading-relaxed">
                      Our signature color schemes are achieved using low-impact, natural botanical dye processes.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#FBF8F4] p-8 rounded-3xl border border-[#E1D6C8] flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-500 group shadow-sm">
                    <div className="size-16 rounded-full bg-[#8B6F54]/10 text-[#8B6F54] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Handshake className="size-8" />
                    </div>
                    <h3 className="text-xl font-medium text-[#2E2A26] font-serif-luxury">Fair Artisan Pay</h3>
                    <p className="text-sm text-muted-foreground font-sans-modern font-light leading-relaxed">
                      Every maker is compensated above standard living wages for their meticulous stitching skills.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* Wave Divider Inverse */}
            <div className="w-full h-12 overflow-hidden text-[#F3EBDD]/35 flex items-start rotate-180 -mx-4 sm:-mx-6 md:-mx-12">
              <svg className="w-full h-full fill-current" preserveAspectRatio="none" viewBox="0 0 1200 120">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.3,130.83,121.22,192.61,102.73,235.31,89.92,279.16,71.21,321.39,56.44Z"></path>
              </svg>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 3: Gallery Section */}
        <RevealOnScroll>
          <section className="max-w-7xl mx-auto space-y-12 py-4" id="gallery">
            
            <header className="text-left space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary font-sans-modern">
                Artisan Space
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#2E2A26]">
                The Atelier Gallery
              </h2>
              <p className="text-muted-foreground font-sans-modern font-light">
                Textures, organic shapes, and the tactile essence of hand-stitched luxury.
              </p>
            </header>

            {/* Masonry Grid Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              
              {/* Image 1 */}
              <div className="break-inside-avoid relative group overflow-hidden rounded-3xl bg-[#F3EBDD] border border-[#E1D6C8] shadow-card">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLBocpKCOgW_y5kboNMEswmodUormDP12Q7N8UObTD_SfyleV2FiuJDHrYP702wWs3V11WHP-J9d5EUTmbEEEJC3Uq1OxstVIGJh7C7F0GvIlGjmQSFxeBhko5b0AslMFUp2nhqJrmKhAYK9jQ87ytjAHlBOUNIsd9pCKPtwnbRhe4UWYxvH1a_kIYBpzQQGzj2l6tgdn87v1spXLRA2Jo4i4Q29al3HYcZ-7OvZEGAblpUTE0VE5q0-GvJwwnzeszr0-dLp2QFg"
                  alt="Macro shot of intricate off-white crochet stitches"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#2E2A26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Image 2 */}
              <div className="break-inside-avoid relative group overflow-hidden rounded-3xl bg-[#F3EBDD] border border-[#E1D6C8] shadow-card">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS9CXxRXnovMa1MpGtsXNjC94W6weS1dkomWV_MPqe1DXqB3xmusAczNBmhhQY5J_-PYuT0vcRS5myJAJWgu11U_8HQa4ELBlbF5y9dZzcWPHpbgHDbcI0EDsVDPHbV18ZGW5Z3naEmBc_ytwqjkfQ67BaAVUoCo_zHFlsBr3Xbc5OoWCD55s-SatKDDsayquzjG2UjIji9QQq0h-1_23oEJ2z2ZnmDDuq9zp-_WFWPjdh9kB_y12w4JapIhWv3m8vWfZU9lkWDQ"
                  alt="Stack of unspun natural cotton and blush pink yarn skeins"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#2E2A26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Image 3 */}
              <div className="break-inside-avoid relative group overflow-hidden rounded-3xl bg-[#F3EBDD] border border-[#E1D6C8] shadow-card">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfjCY48uUzd6BnHrn6FBaWy5iLRpbfNRbgjqhplHN71KkUfxgGNAPQdf_uVe1wE0PdjacPgkbuQ59DPMHaJz5klfOurN23t0FxWhNUBDt4nTX11MVorvFz9hjlTtDXl-r12wZqxfp4yYWOevtOvcH1MJxp3KYeCkoDKNIpfM3eZc4PM1acpZXkRwjkjlIklszogLz6DnC0Y9QvA-UoPZdf9DwvPos_wdf8sSKaPI8mq61rPMG6nDvgbrv6yx3WsRVQ6I6eZ70oFA"
                  alt="Editorial model wearing chunky rose pink crochet cardigan"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#2E2A26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Image 4 */}
              <div className="break-inside-avoid relative group overflow-hidden rounded-3xl bg-[#F3EBDD] border border-[#E1D6C8] shadow-card">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACKTt0FRguEMATimAcV0XFUHF9BnnERPdYfmVpsI62-CsUXLvuE5nVzbwCKbtbGtUkvE8jcTRgDvhKDiT1saQGJE1zIhckVbL7qwflMmy-k0pz-wugPjJ-t0wtGqaB6RUNzqy_3nY6TIdKmSsu45UqXOEhWiz8IOabDDetV7cBfcloPabSN3VD4FdB7HT0SPddPDZPRu1HduOlEA4PL2tgWJxyI3r6q0XVdduSZwJTF34hAAJL3prJP8gUYtw5Jp6N2spFTzyCBQ"
                  alt="Minimalist sand-colored crochet bag with leather straps"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#2E2A26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Image 5 */}
              <div className="break-inside-avoid relative group overflow-hidden rounded-3xl bg-[#F3EBDD] border border-[#E1D6C8] shadow-card">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcuf0Xs4KYIaF1crqI3aBcGqQNZc4ZWDSarIwCsMiuzK1WLBFhWiy32i58BLFenPjT8waQ6Al0mrsBYdg9M1E_dt5NFysAL_2NFgpeQaHv1kRChzcWRYJ_weTcr90p565Xxi4wlTBLRZu1BaUtVu47pQhS-ZCu7c03nvYqmdW-q0wjLVp4R0j-C9BZXAMeV4kTLoHnA4lHS_RwZ47Ebv7Vwan15mg5WntR6a61RLqAXMz5mwXBfTZ56Hpg-ybntg2WdX9_Jcu0eA"
                  alt="Hands weaving bright rose pink yarn with wooden hook"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#2E2A26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Interactive Heart Card */}
              <div className="break-inside-avoid relative overflow-hidden rounded-3xl bg-[#F3EBDD]/45 border border-[#E1D6C8] p-8 flex flex-col items-center justify-center min-h-[250px] shadow-sm hover:bg-[#F3EBDD]/60 transition-colors duration-500 text-center">
                <Heart className="size-12 text-primary animate-pulse mb-4 shrink-0" />
                <h3 className="text-xl font-medium text-[#2E2A26] font-serif-luxury">Made by Hand</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-sans-modern font-semibold mt-1">
                  With love, always.
                </p>
              </div>

            </div>
          </section>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default About;
