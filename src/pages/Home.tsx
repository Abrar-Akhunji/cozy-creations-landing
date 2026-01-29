import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroYarnBg from "@/assets/hero-yarn-bg.jpg";
import knittedAccessories from "@/assets/knitted-accessories.jpg";
import sweaterProduct from "@/assets/sweater-product.jpg";
import hatProduct from "@/assets/hat-product.jpg";
import mittensProduct from "@/assets/mittens-product.jpg";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const Home = () => {
  const whatsappUrl = createWhatsAppUrl(
    "Hi! I'd like to know more about TwinHooks crochet products."
  );

  const featured = [
    { img: sweaterProduct, title: "Cozy Sweaters", price: "From ₹1,499" },
    { img: hatProduct, title: "Stylish Hats", price: "From ₹399" },
    { img: mittensProduct, title: "Warm Mittens", price: "From ₹499" },
  ];

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <p className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
            Premium handmade crochet
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Handcrafted <span className="text-primary">Warmth</span>
            <br />
            by TwinHooks
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Natural yarns, thoughtful design, and heirloom-quality stitches—made
            to order in India.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="h-11 px-6 inline-flex items-center rounded-full bg-primary text-primary-foreground font-medium hover:opacity-95 transition-opacity"
            >
              Shop Collection <ArrowRight className="ml-2 size-4" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="h-11 px-6 inline-flex items-center rounded-full bg-card border border-border font-medium hover:shadow-card transition-shadow"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-border bg-card aspect-[4/3] shadow-card">
          <img
            src={heroYarnBg}
            alt="Yarn texture background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-background/30 to-transparent" />
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Why Choose TwinHooks
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Experience true craftsmanship—designed to feel premium and personal.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Natural yarns",
              desc: "Comfort-first materials with an artisanal finish.",
            },
            {
              title: "Made to order",
              desc: "Sizes, colors, and custom details—crafted for you.",
            },
            {
              title: "Heirloom quality",
              desc: "Durable stitches and clean finishing that lasts.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="size-11 rounded-xl bg-accent mb-4" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Our Story
          </h2>
          <p className="text-muted-foreground">
            TwinHooks is built on slow fashion—each stitch is a small promise of
            warmth, care, and craft.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center text-primary font-medium story-link"
          >
            Learn more
          </Link>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-border bg-card aspect-[4/3] shadow-card">
          <img
            src={knittedAccessories}
            alt="Hands crafting knitted accessories"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* CURATED GALLERY */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Curated Gallery
            </h2>
            <p className="text-muted-foreground">Latest pieces and textures.</p>
          </div>
          <Link to="/gallery" className="text-sm font-medium text-primary">
            View all
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <article
              key={p.title}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-hover transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-2">
                <p className="text-xs text-primary font-medium uppercase tracking-wide">
                  Finished piece
                </p>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
