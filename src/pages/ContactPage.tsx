import Contact from "@/components/Contact";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const ContactPage = () => {
  const whatsappUrl = createWhatsAppUrl(
    "Hi! I'd like to enquire about a custom TwinHooks order."
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Contact</h1>
        <p className="text-muted-foreground max-w-2xl">
          Reach out for custom sizes, colors, gifting, or bulk orders.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-primary-foreground font-medium"
        >
          Message on WhatsApp
        </a>
      </header>

      <Contact />
    </div>
  );
};

export default ContactPage;
