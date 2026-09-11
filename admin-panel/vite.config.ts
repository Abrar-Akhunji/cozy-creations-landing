import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import crypto from "crypto";

// ─── Cloudinary Sign Middleware ────────────────────────────────────────────────
// POST /cloudinary-sign  →  returns { signature, timestamp, folder, api_key }
//
// WHY loadEnv instead of process.env:
//   Vite only injects VITE_* keys into process.env automatically.
//   Non-prefixed keys like CLOUDINARY_API_SECRET are NOT available in process.env
//   inside a Vite plugin. loadEnv() with prefix='' reads the full .env file so
//   the secret stays server-side and is never shipped to the browser.
// ──────────────────────────────────────────────────────────────────────────────
function cloudinarySignPlugin(env: Record<string, string>) {
  return {
    name: "cloudinary-sign",
    configureServer(server: any) {
      server.middlewares.use(
        "/cloudinary-sign",
        (req: any, res: any, next: any) => {
          if (req.method !== "POST") return next();

          // Read from the env map built by loadEnv() — always available
          const apiSecret = env.CLOUDINARY_API_SECRET;
          const apiKey    = env.CLOUDINARY_API_KEY;
          const folder    = env.CLOUDINARY_FOLDER || "products";

          if (!apiSecret || !apiKey) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error:
                  "CLOUDINARY_API_SECRET and CLOUDINARY_API_KEY must be set in admin-panel/.env",
              })
            );
            return;
          }

          // Build a SHA-256 signature exactly as Cloudinary expects:
          // Sort params alphabetically → join with & → append api_secret → SHA-256
          const timestamp     = Math.round(Date.now() / 1000);
          const paramsToSign  = `folder=${folder}&timestamp=${timestamp}`;
          const signature     = crypto
            .createHash("sha256")
            .update(paramsToSign + apiSecret)
            .digest("hex");

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ signature, timestamp, folder, api_key: apiKey })
          );
        }
      );
    },
  };
}

// Export as a factory function so we can call loadEnv() before building the config
export default defineConfig(({ mode }) => {
  // loadEnv(mode, root, prefix)
  //   prefix = '' → loads ALL .env keys (not just VITE_* ones)
  //   This is how we safely read CLOUDINARY_API_SECRET server-side.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), cloudinarySignPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5174,
    },
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "firebase-vendor": ["firebase/app", "firebase/firestore", "firebase/auth"],
          },
        },
      },
    },
  };
});
