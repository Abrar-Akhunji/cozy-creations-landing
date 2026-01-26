import { Card, CardContent } from "@/components/ui/card";
import artisanPortrait from "@/assets/artisan-portrait.jpg";

const AboutMe = () => {
  const storyCards = [
    {
      text: "Hi! I'm passionate about creating beautiful, handmade pieces that bring warmth and joy to people's lives. Every project I undertake is infused with love and dedication.",
    },
    {
      text: "For over 10 years, I've been perfecting the art of crochet. What started as a hobby has blossomed into a calling – transforming premium yarns into timeless, wearable art.",
    },
    {
      text: "I believe in the beauty of slow fashion and sustainable craftsmanship. Each stitch is a meditation, each piece a unique creation that can't be replicated by machines.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-accent/20">
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">
            About Me
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            Meet the Artisan
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left - Story Cards */}
          <div className="space-y-6">
            {storyCards.map((card, index) => (
              <Card
                key={index}
                className="bg-card border-border rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardContent className="p-8">
                  <p className="text-foreground/90 leading-relaxed text-lg">
                    {card.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right - Portrait */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img
                src={artisanPortrait}
                alt="Artisan portrait"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/20 rounded-full opacity-50 blur-3xl -z-10" />
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-accent rounded-full opacity-40 blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;