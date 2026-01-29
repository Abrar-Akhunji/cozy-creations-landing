import yarnBall from "@/assets/yarn-ball.jpg";
import hatProduct from "@/assets/hat-product.jpg";
import mittensProduct from "@/assets/mittens-product.jpg";
import sweaterProduct from "@/assets/sweater-product.jpg";
import knittedAccessories from "@/assets/knitted-accessories.jpg";

const Gallery = () => {
  const chips = ["All Works", "Wearables", "Home Decor", "Seasonal", "Abstract"];
  const items = [
    { img: yarnBall, title: "Yarn textures" },
    { img: knittedAccessories, title: "Wall hang" },
    { img: hatProduct, title: "Beanie" },
    { img: sweaterProduct, title: "Sweater" },
    { img: mittensProduct, title: "Mittens" },
  ];

  return (
    <div className="space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          The Art of the Stitch
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every loop tells a story. Explore textures, finishes, and custom work.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {chips.map((c, i) => (
            <button
              key={c}
              className={
                i === 0
                  ? "h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
                  : "h-10 px-5 rounded-full bg-card border border-border text-sm font-medium"
              }
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <section className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {items.map((it) => (
          <article
            key={it.title}
            className="mb-6 break-inside-avoid rounded-3xl overflow-hidden border border-border bg-card shadow-card"
          >
            <img
              src={it.img}
              alt={it.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </article>
        ))}

        <article className="mb-6 break-inside-avoid rounded-3xl border border-border bg-card p-8 shadow-card">
          <p className="text-sm text-muted-foreground">“</p>
          <p className="mt-3 text-lg leading-relaxed">
            The attention to detail is simply breathtaking. It’s not just a piece—
            it feels like wearable art.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Elena R. • Verified buyer</p>
        </article>
      </section>

      <div className="flex justify-center">
        <button
          className="h-11 px-6 rounded-full border border-border bg-card font-medium"
          type="button"
        >
          Load More Creations
        </button>
      </div>
    </div>
  );
};

export default Gallery;
