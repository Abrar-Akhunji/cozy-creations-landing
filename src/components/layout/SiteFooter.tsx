import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-content px-6 md:px-12 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="text-lg font-semibold tracking-tight">TwinHooks</div>
            <p className="text-sm text-muted-foreground">
              Handmade crochet pieces—crafted slowly, worn forever.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-primary transition-colors" to="/shop">
                  Shop
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" to="/gallery">
                  Gallery
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" to="/about">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-primary transition-colors" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" to="/blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Stay in the loop</h3>
            <div className="flex gap-2">
              <input
                className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm"
                placeholder="Your email address"
                aria-label="Email"
              />
              <button
                className="h-11 px-5 rounded-full bg-primary text-primary-foreground font-medium"
                type="button"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              We’ll only send occasional updates.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TwinHooks. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link className="hover:text-primary transition-colors" to="#">
              Privacy Policy
            </Link>
            <Link className="hover:text-primary transition-colors" to="#">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
