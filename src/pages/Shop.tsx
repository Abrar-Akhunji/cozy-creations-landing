import sweaterProduct from "@/assets/sweater-product.jpg";
import hatProduct from "@/assets/hat-product.jpg";
import mittensProduct from "@/assets/mittens-product.jpg";
import knittedAccessories from "@/assets/knitted-accessories.jpg";

const Shop = () => {
  const products = [
    { img: sweaterProduct, category: "Wearables", title: "Cozy Sweater", price: "₹1,499" },
    { img: hatProduct, category: "Hats", title: "Azure Beanie", price: "₹399" },
    { img: mittensProduct, category: "Wearables", title: "Classic Mittens", price: "₹499" },
    { img: knittedAccessories, category: "Accessories", title: "Texture Set", price: "₹799" },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight">Shop</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse ready-to-order pieces and made-to-order designs.
        </p>
      </header>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        <aside className="rounded-2xl border border-border bg-card p-6 h-fit shadow-card">
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold">Category</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> All Items
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Hats & Beanies
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Sweaters
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Accessories
                </label>
              </div>
            </div>

            <div>
              <h2 className="font-semibold">Price Range</h2>
              <div className="mt-3 h-10 rounded-xl bg-accent/40" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>₹199</span>
                <span>₹2,499</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{products.length} products found</p>
            <div className="rounded-full border border-border bg-card px-4 h-10 flex items-center text-sm shadow-card">
              Sort: Featured
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => (
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
                    {p.category}
                  </p>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="font-semibold">{p.price}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center gap-2 pt-6">
            {["1", "2", "3"].map((p) => (
              <button
                key={p}
                className="size-10 rounded-full border border-border bg-card shadow-card hover:shadow-hover transition-shadow"
                type="button"
              >
                {p}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shop;
