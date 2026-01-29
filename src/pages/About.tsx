import artisanPortrait from "@/assets/artisan-portrait.jpg";

const About = () => {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight">About TwinHooks</h1>
        <p className="text-muted-foreground max-w-2xl">
          A small studio built around slow fashion, comfort, and clean finishing.
        </p>
      </header>

      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">Meet the artisan</h2>
          <p className="text-muted-foreground">
            Every order is crafted by hand—designed with care, adjusted to your
            preferences, and finished to last.
          </p>
          <div className="grid gap-4">
            {[
              "10+ years of crochet practice",
              "Natural yarns and premium blends",
              "Custom sizing and color options",
            ].map((t) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <p className="font-medium">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-card">
          <img
            src={artisanPortrait}
            alt="Artisan portrait"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
