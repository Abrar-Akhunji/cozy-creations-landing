import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import sweaterProduct from "@/assets/sweater-product.jpg";
import hatProduct from "@/assets/hat-product.jpg";
import mittensProduct from "@/assets/mittens-product.jpg";
import darkYarnBg from "@/assets/dark-yarn-bg.jpg";

const Catalog = () => {
  const whatsappNumber = "1234567890";
  const whatsappMessage = "Hi! I'd like to know more about your crochet products.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const products = [
    {
      image: sweaterProduct,
      title: "Cozy Sweaters",
      description:
        "Warm, comfortable sweaters perfect for any season. Each piece is uniquely designed and crafted to provide both style and comfort.",
    },
    {
      image: hatProduct,
      title: "Stylish Hats",
      description:
        "From beanies to berets, our handmade hats combine fashion with function. Stay warm while looking effortlessly chic.",
    },
    {
      image: mittensProduct,
      title: "Warm Mittens",
      description:
        "Keep your hands toasty with our soft, handcrafted mittens. Available in various colors and patterns to match your style.",
    },
  ];

  return (
    <section
      id="catalog"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: `linear-gradient(rgba(46, 42, 38, 0.92), rgba(46, 42, 38, 0.92)), url(${darkYarnBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-content mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">
            Our Collection
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            You Can Order
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore our curated selection of handmade treasures, each one crafted
            with care and attention to detail.
          </p>
        </div>

        {/* Product Cards */}
        <div className="space-y-8 md:space-y-10">
          {products.map((product, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ProductCard
                image={product.image}
                title={product.title}
                description={product.description}
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16 md:mt-20">
          <Button
            asChild
            size="lg"
            className="rounded-full text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 shadow-hover"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Contact me
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Catalog;