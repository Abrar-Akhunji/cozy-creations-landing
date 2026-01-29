import sweaterProduct from "@/assets/sweater-product.jpg";
import mittensProduct from "@/assets/mittens-product.jpg";
import hatProduct from "@/assets/hat-product.jpg";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const Cart = () => {
  const items = [
    { img: sweaterProduct, title: "Handmade Sweater", meta: ["Color: Cream", "Material: Wool"], price: "₹1,499" },
    { img: hatProduct, title: "Chunky Beanie", meta: ["Size: One size", "Pattern: Classic"], price: "₹399" },
    { img: mittensProduct, title: "Warm Mittens", meta: ["Size: M", "Material: Wool blend"], price: "₹499" },
  ];

  const whatsappUrl = createWhatsAppUrl(
    "Hi! I'd like to place an order with TwinHooks. Please share availability and delivery details."
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Your Shopping Bag</h1>
        <p className="text-muted-foreground">{items.length} items in your cart</p>
      </header>

      <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
        <section className="space-y-5">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row gap-5 shadow-card"
            >
              <img
                src={it.img}
                alt={it.title}
                className="w-full sm:size-24 rounded-2xl object-cover"
                loading="lazy"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{it.title}</h2>
                    <div className="mt-1 space-y-0.5">
                      {it.meta.map((m) => (
                        <p key={m} className="text-sm text-muted-foreground">
                          {m}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-primary" type="button">
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="font-semibold">{it.price}</p>
                  <div className="rounded-full border border-border bg-background px-2 h-10 flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full bg-card" type="button">
                      -
                    </button>
                    <span className="w-6 text-center">1</span>
                    <button className="w-8 h-8 rounded-full bg-card" type="button">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-card">
          <h2 className="text-2xl font-semibold">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹2,397</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping estimate</span>
              <span>₹80</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax estimate</span>
              <span>₹0</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between items-end">
            <span className="font-semibold">Order Total</span>
            <span className="text-3xl font-semibold">₹2,477</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm"
              placeholder="Promo code"
              aria-label="Promo code"
            />
            <button
              className="h-11 px-5 rounded-full border border-border bg-card font-medium"
              type="button"
            >
              Apply
            </button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="h-12 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center hover:opacity-95 transition-opacity"
          >
            Proceed to WhatsApp
          </a>

          <p className="text-xs text-muted-foreground">
            Payments and confirmations happen via WhatsApp.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
