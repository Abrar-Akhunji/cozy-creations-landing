import { Heart, Sparkles, Leaf, Award } from "lucide-react";
import FeatureCard from "./FeatureCard";

const WhyChooseMe = () => {
  const features = [
    {
      icon: Heart,
      title: "Handmade with Love",
      description:
        "Each piece is carefully crafted by hand, ensuring unique quality and attention to detail that machines simply cannot replicate.",
    },
    {
      icon: Sparkles,
      title: "Custom Designs",
      description:
        "Your vision brought to life. I work closely with you to create personalized pieces that perfectly match your style and preferences.",
    },
    {
      icon: Leaf,
      title: "Natural Materials",
      description:
        "Only premium, eco-friendly yarns and materials are used, ensuring comfort, durability, and a sustainable choice for your wardrobe.",
    },
    {
      icon: Award,
      title: "Expert Craftsmanship",
      description:
        "Years of experience and passion go into every stitch, resulting in heirloom-quality pieces that will last for generations.",
    },
  ];

  return (
    <section id="superiority" className="py-24 md:py-32 bg-background">
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">
            Why Choose Me
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            Crafted with Excellence
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;