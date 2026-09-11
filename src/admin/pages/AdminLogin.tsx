import React, { useState } from "react";
import { ShieldAlert, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLogin: React.FC = () => {
  const { user, loginError, whitelistError, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsSubmitting(true);
    await login(email.trim(), password);
    setIsSubmitting(false);
  };

  // Authenticated but NOT whitelisted
  if (user && whitelistError) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 20,
        }}
      >
        <div
          className="admin-animate-fade-in-up"
          style={{
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          {/* Denied banner card */}
          <div
            style={{
              background: "var(--admin-danger-muted)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: 20,
              padding: "32px 24px",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "rgba(239, 68, 68, 0.15)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <ShieldAlert size={28} style={{ color: "var(--admin-danger)" }} />
            </div>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--admin-danger)",
                marginBottom: 8,
                letterSpacing: "-0.02em",
              }}
            >
              Security Access Denied
            </h2>

            <p
              style={{
                fontSize: 13,
                color: "var(--admin-text-secondary)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              {whitelistError}
            </p>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                background: "var(--admin-bg-subtle)",
                border: "1px solid var(--admin-border)",
                fontSize: 12,
                color: "var(--admin-text-muted)",
              }}
            >
              Signed in as:{" "}
              <span style={{ color: "var(--admin-text)", fontWeight: 600 }}>
                {user.email}
              </span>
            </div>
          </div>

          {/* Go back / sign out CTA */}
          <button
            onClick={() => window.location.reload()}
            className="admin-btn-ghost"
            style={{ marginTop: 20, width: "100%" }}
          >
            ← Sign Out & Try Again
          </button>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <div
        className="admin-animate-fade-in-up"
        style={{ width: "100%", maxWidth: 380 }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "var(--admin-accent-muted)",
              border: "1px solid rgba(217, 119, 6, 0.25)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
            }}
          >
            <Lock size={24} style={{ color: "var(--admin-accent)" }} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 4,
            }}
          >
            Twin Hooks <span style={{ color: "var(--admin-accent)" }}>Admin</span>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--admin-text-muted)",
              lineHeight: 1.5,
            }}
          >
            Sign in with your administrator credentials
          </p>
        </div>

        {/* Login Card */}
        <div
          className="admin-card"
          style={{ padding: "28px 24px", borderRadius: 20 }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">
                <Mail size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                Administrator Email
              </label>
              <input
                type="email"
                className="admin-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="admin-label">
                <Lock size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                Security Passcode
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="admin-input"
                  style={{ paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--admin-text-muted)",
                    cursor: "pointer",
                    padding: 6,
                    display: "grid",
                    placeItems: "center",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error State */}
            {loginError && (
              <div
                className="admin-animate-fade-in"
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "var(--admin-danger-muted)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  fontSize: 12,
                  color: "var(--admin-danger)",
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="admin-btn-primary"
              style={{ width: "100%", height: 48, fontSize: 15, borderRadius: 14 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="admin-animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--admin-text-muted)",
            marginTop: 20,
            lineHeight: 1.5,
          }}
        >
          Only whitelisted administrators can access this panel.
          <br />
          Contact the store owner if you need access.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
