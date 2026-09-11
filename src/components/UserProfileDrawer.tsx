import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Save,
  CheckCircle2,
  UserCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  pincode: string;
  address: string;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);

  // Load profile from localStorage on mount/open
  useEffect(() => {
    if (isOpen) {
      setSaved(false);
      const storedRaw = localStorage.getItem("twinhooks_user_profile");
      if (storedRaw) {
        try {
          const profile: UserProfile = JSON.parse(storedRaw);
          setName(profile.name || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setPincode(profile.pincode || "");
          setAddress(profile.address || "");
        } catch (e) {
          console.error("Failed to parse user profile:", e);
        }
      }
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      pincode: pincode.trim(),
      address: address.trim(),
    };
    localStorage.setItem("twinhooks_user_profile", JSON.stringify(profile));
    setSaved(true);
    toast.success("Profile saved successfully!");
    setTimeout(() => setSaved(false), 2500);
  };

  const hasProfile = name.trim() !== "";

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Customer Profile"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          width: "min(420px, 100vw)",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #fdfaf6 0%, #f5ede2 100%)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          transform: isOpen ? "translateX(0)" : "translateX(105%)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
          overflowY: "auto",
        }}
      >
        {/* Decorative top stripe */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg, #c8845a, #e8b89a, #c8845a)",
            flexShrink: 0,
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(200,132,90,0.18)",
            flexShrink: 0,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar bubble */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c8845a, #e8b89a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(200,132,90,0.3)",
                flexShrink: 0,
              }}
            >
              {hasProfile ? (
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: "-0.5px",
                    fontFamily: "serif",
                  }}
                >
                  {name.trim()[0].toUpperCase()}
                </span>
              ) : (
                <UserCircle2 size={22} color="#fff" strokeWidth={1.8} />
              )}
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#c8845a",
                }}
              >
                Your Account
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#2e2a26",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  lineHeight: 1.2,
                }}
              >
                {hasProfile ? name.split(" ")[0] : "Customer Profile"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close profile drawer"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(200,132,90,0.25)",
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b5e54",
              transition: "background 0.2s, color 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
              (e.currentTarget as HTMLButtonElement).style.color = "#c8845a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.7)";
              (e.currentTarget as HTMLButtonElement).style.color = "#6b5e54";
            }}
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", flex: 1 }}>
          {/* Info Banner */}
          <div
            style={{
              background: "rgba(200,132,90,0.08)",
              border: "1px solid rgba(200,132,90,0.2)",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 24,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Sparkles
              size={15}
              color="#c8845a"
              style={{ marginTop: 1, flexShrink: 0 }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#7a5c48",
                lineHeight: 1.55,
              }}
            >
              Save your shipping details here for a faster, single-click
              checkout experience. Everything is stored locally on your browser.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Full Name */}
              <FieldGroup label="Full Name" icon={<User size={13} />}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => applyFocusStyle(e.currentTarget)}
                  onBlur={(e) => removeFocusStyle(e.currentTarget)}
                />
              </FieldGroup>

              {/* Email */}
              <FieldGroup label="Contact Email" icon={<Mail size={13} />}>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => applyFocusStyle(e.currentTarget)}
                  onBlur={(e) => removeFocusStyle(e.currentTarget)}
                />
              </FieldGroup>

              {/* Phone + Pincode row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <FieldGroup label="Phone" icon={<Phone size={13} />}>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => applyFocusStyle(e.currentTarget)}
                    onBlur={(e) => removeFocusStyle(e.currentTarget)}
                  />
                </FieldGroup>

                <FieldGroup label="Pincode" icon={<Hash size={13} />}>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit ZIP"
                    value={pincode}
                    onChange={(e) =>
                      setPincode(e.target.value.replace(/\D/g, ""))
                    }
                    style={inputStyle}
                    onFocus={(e) => applyFocusStyle(e.currentTarget)}
                    onBlur={(e) => removeFocusStyle(e.currentTarget)}
                  />
                </FieldGroup>
              </div>

              {/* Address */}
              <FieldGroup label="Full Street Address" icon={<MapPin size={13} />}>
                <textarea
                  required
                  rows={3}
                  placeholder="House number, street, area, city, state"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ ...inputStyle, height: "auto", resize: "none", paddingTop: 10 }}
                  onFocus={(e) => applyFocusStyle(e.currentTarget)}
                  onBlur={(e) => removeFocusStyle(e.currentTarget)}
                />
              </FieldGroup>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              style={{
                marginTop: 28,
                width: "100%",
                height: 50,
                borderRadius: 99,
                border: "none",
                background: saved
                  ? "linear-gradient(135deg, #4caf82, #3a9e6f)"
                  : "linear-gradient(135deg, #c8845a, #b56b3e)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: saved
                  ? "0 6px 20px rgba(76,175,130,0.35)"
                  : "0 6px 20px rgba(200,132,90,0.35)",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {saved ? (
                <>
                  <CheckCircle2 size={17} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Profile Details
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid rgba(200,132,90,0.15)",
            textAlign: "center",
            background: "rgba(255,255,255,0.5)",
            flexShrink: 0,
          }}
        >
          <p style={{ margin: 0, fontSize: 11, color: "#b09a8a" }}>
            🔒 Your data stays on your device and is never shared.
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(drawer, document.body);
};

/* ── Helpers ── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 10,
  border: "1.5px solid rgba(200,132,90,0.2)",
  background: "rgba(255,255,255,0.85)",
  padding: "0 14px",
  fontSize: 14,
  color: "#2e2a26",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

function applyFocusStyle(el: HTMLElement) {
  (el as HTMLInputElement | HTMLTextAreaElement).style.borderColor = "#c8845a";
  (el as HTMLInputElement | HTMLTextAreaElement).style.boxShadow =
    "0 0 0 3px rgba(200,132,90,0.15)";
}
function removeFocusStyle(el: HTMLElement) {
  (el as HTMLInputElement | HTMLTextAreaElement).style.borderColor =
    "rgba(200,132,90,0.2)";
  (el as HTMLInputElement | HTMLTextAreaElement).style.boxShadow = "none";
}

function FieldGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#a07860",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span style={{ color: "#c8845a" }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
