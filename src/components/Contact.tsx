import React, { useState } from "react";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { 
  Phone, 
  Instagram, 
  Facebook, 
  Mail, 
  MessageCircle, 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { toast } from "sonner";

interface YarnColor {
  name: string;
  hex: string;
}

const YARN_COLORS: YarnColor[] = [
  { name: "Organic Cream", hex: "#F5EFEB" },
  { name: "Sage Earth", hex: "#8D9B82" },
  { name: "Rose Blush", hex: "#D4A3A9" },
  { name: "Warm Taupe", hex: "#8B6F54" },
  { name: "Mustard Gold", hex: "#E4B062" },
];

const Contact = () => {
  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sweaters & Cardigans");
  const [size, setSize] = useState("Medium (M)");
  const [selectedColor, setSelectedColor] = useState("Organic Cream");
  const [details, setDetails] = useState("");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name to proceed.");
      return;
    }

    const message = `Hello Crochet Shop! 🧶 I'd like to inquire about a custom handcrafted order:\n\n` +
      `*Name:* ${name.trim()}\n` +
      `*Category:* ${category}\n` +
      `*Preferred Size:* ${size}\n` +
      `*Color Palette:* ${selectedColor}\n` +
      `*Custom Details:* ${details.trim() || "No specific design notes yet. Let's discuss details!"}`;

    const url = createWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("WhatsApp inquiry drafted! Opening chat...");
  };

  const contactChannels = [
    {
      icon: <Phone className="size-5 text-primary" />,
      label: "Call or Message",
      value: "+91 9586030292",
      link: "https://wa.me/919586030292",
      badge: "WhatsApp Active",
    },
    {
      icon: <Instagram className="size-5 text-primary" />,
      label: "Atelier Instagram",
      value: "@twinhooks.art",
      link: "https://instagram.com/twinhooks.art",
    },
    {
      icon: <Mail className="size-5 text-primary" />,
      label: "Support Email",
      value: "twinhooks.art@gmail.com",
      link: "mailto:twinhooks.art@gmail.com",
    },
  ];

  const faqs = [
    {
      q: "How long does a custom creation take to stitch?",
      a: "Since every single loop is hand-crafted slowly, custom orders typically take 7 to 14 days to weave and assemble depending on the design's complexity.",
    },
    {
      q: "Can I customize sizing and fit details?",
      a: "Absolutely. In the inquiry details block, feel free to share your specific chest, sleeve length, or length measurements and we will tailor it to fit you perfectly.",
    },
    {
      q: "What types of organic yarns do you offer?",
      a: "We choose premium natural fibers: breathable organic cotton (perfect for summer tops), bamboo-blends (super soft and silky), and cozy merino wool (for cardigans and beanies).",
    },
    {
      q: "Do you ship custom orders nationwide?",
      a: "Yes, we ship to all pin codes across India. Delivery is free on all custom commissions and shop orders over ₹999. Otherwise, a standard charge of ₹80 applies.",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background glow effects matching About/Home pages */}
      <div className="absolute top-10 left-10 size-[300px] md:size-[450px] bg-primary/5 rounded-full filter blur-[100px] animate-pulse-slow pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 size-[350px] md:size-[500px] bg-[#EAD8BC]/10 rounded-full filter blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16 md:space-y-24">
        
        {/* Editorial Title Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-[#EAD8BC]/20 border border-[#EAD8BC]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-muted-foreground font-sans-modern">
            Let's Stitch Together
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.05] text-[#2E2A26]">
            Connect with
            <br />
            <span className="text-primary italic font-light font-serif-luxury block mt-2">Our Atelier.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-sans-modern font-light leading-relaxed max-w-2xl mx-auto">
            Have a dream custom sweater, toy, or cardigan in mind? Fill out our design builder to compile a custom commission order and coordinate directly with us via WhatsApp.
          </p>
        </header>

        {/* Form and Contact Grid */}
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          
          {/* Custom Commission Builder Form Card */}
          <div className="rounded-3xl border border-[#E1D6C8] bg-[#F3EBDD]/45 p-6 sm:p-10 shadow-card space-y-8">
            <header className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary font-sans-modern flex items-center gap-1.5">
                <Sparkles className="size-4 animate-pulse" /> Custom Design Builder
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium text-[#2E2A26] font-serif-luxury">
                Describe Your Masterpiece
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans-modern font-light">
                Tell us your ideas. We will construct a clean formatted message to launch our direct WhatsApp discussion.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input */}
              <div className="space-y-2 text-left">
                <label htmlFor="client-name" className="text-xs font-semibold uppercase tracking-wider text-[#2E2A26]/80 font-sans-modern">
                  Your Name
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E1D6C8] bg-white/80 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans-modern text-[#2E2A26]"
                />
              </div>

              {/* Grid selectors */}
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Category Selection */}
                <div className="space-y-2 text-left">
                  <label htmlFor="creation-category" className="text-xs font-semibold uppercase tracking-wider text-[#2E2A26]/80 font-sans-modern">
                    Creations Category
                  </label>
                  <select
                    id="creation-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E1D6C8] bg-white/80 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans-modern text-[#2E2A26]"
                  >
                    <option>Sweaters & Cardigans</option>
                    <option>Beanies & Hats</option>
                    <option>Bags & Purses</option>
                    <option>Amigurumi Toys</option>
                    <option>Home Decor</option>
                    <option>Custom Request (Other)</option>
                  </select>
                </div>

                {/* Size Selection */}
                <div className="space-y-2 text-left">
                  <label htmlFor="creation-size" className="text-xs font-semibold uppercase tracking-wider text-[#2E2A26]/80 font-sans-modern">
                    Preferred Size / Fit
                  </label>
                  <select
                    id="creation-size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E1D6C8] bg-white/80 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans-modern text-[#2E2A26]"
                  >
                    <option>Small (S)</option>
                    <option>Medium (M)</option>
                    <option>Large (L)</option>
                    <option>Custom Sizing (Discuss Details)</option>
                    <option>Not Applicable (Toys/Decor)</option>
                  </select>
                </div>

              </div>

              {/* Color Selector Chips */}
              <div className="space-y-3 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2E2A26]/80 font-sans-modern">
                  Primary Color Choice: <span className="font-bold text-primary font-serif-luxury italic ml-1">{selectedColor}</span>
                </label>
                
                <div className="flex flex-wrap gap-3">
                  {YARN_COLORS.map((col) => {
                    const isSelected = selectedColor === col.name;
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col.name)}
                        className={`group relative flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium transition-all ${
                          isSelected 
                            ? "bg-primary text-white border-primary shadow-sm scale-105 animate-pulse-slow" 
                            : "bg-white border-[#E1D6C8] hover:bg-[#FBF8F4] text-[#2E2A26]"
                        }`}
                      >
                        <span 
                          className="size-3.5 rounded-full border border-black/10 inline-block shrink-0" 
                          style={{ backgroundColor: col.hex }} 
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Details text area */}
              <div className="space-y-2 text-left">
                <label htmlFor="design-details" className="text-xs font-semibold uppercase tracking-wider text-[#2E2A26]/80 font-sans-modern">
                  Design Specifications & Notes
                </label>
                <textarea
                  id="design-details"
                  rows={4}
                  placeholder="Share details: stitch styles (e.g. cable-knit, puff-stitch), specific color combinations, or sleeve details..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded-xl border border-[#E1D6C8] bg-white/80 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans-modern text-[#2E2A26] resize-none"
                />
              </div>

              {/* Action button */}
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-primary/10 transition-all active:scale-[0.99] font-sans-modern text-sm"
              >
                <MessageCircle className="size-4" /> Start Inquiry via WhatsApp
              </button>

            </form>
          </div>

          {/* Right Column: Channels & FAQ */}
          <div className="space-y-12">
            
            {/* Direct Channels */}
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#2E2A26]/40 font-sans-modern block text-left">
                Direct Channels
              </span>

              <div className="grid gap-4">
                {contactChannels.map((channel, i) => (
                  <a
                    key={i}
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 rounded-2xl border border-[#E1D6C8] bg-[#F3EBDD]/20 hover:bg-[#F3EBDD]/45 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="size-11 rounded-xl bg-[#EAD8BC]/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {channel.icon}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#7A6F66] font-sans-modern leading-none mb-1">
                          {channel.label}
                        </p>
                        <p className="font-semibold text-[#2E2A26] font-sans-modern text-sm leading-normal">
                          {channel.value}
                        </p>
                      </div>
                    </div>

                    {channel.badge ? (
                      <span className="text-[10px] font-bold text-green-700 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full shrink-0">
                        {channel.badge}
                      </span>
                    ) : (
                      <Send className="size-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ section */}
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#2E2A26]/40 font-sans-modern block text-left">
                Common Questions
              </span>

              <div className="border border-[#E1D6C8] bg-[#F3EBDD]/15 rounded-2xl divide-y divide-[#E1D6C8] overflow-hidden">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="transition-colors">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full py-4.5 px-5 flex items-center justify-between text-left gap-4 font-semibold text-[#2E2A26] hover:bg-[#F3EBDD]/25 transition-colors"
                        type="button"
                      >
                        <span className="font-sans-modern text-sm">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="size-4 text-primary shrink-0" />
                        ) : (
                          <ChevronDown className="size-4 text-[#7A6F66] shrink-0" />
                        )}
                      </button>

                      {/* Smooth collapsible answer */}
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpen ? "max-h-40 border-t border-[#E1D6C8]/60" : "max-h-0 pointer-events-none"
                        }`}
                      >
                        <div className="p-5 text-xs sm:text-sm text-muted-foreground font-sans-modern font-light leading-relaxed bg-[#FBF8F4]/30 text-left">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

export default Contact;