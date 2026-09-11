import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, MapPin, Hash, Save } from "lucide-react";
import { toast } from "sonner";

interface UserProfileModalProps {
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

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");

  // Load profile from localStorage on mount/open
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("twinhooks_user_profile");
      if (saved) {
        try {
          const profile: UserProfile = jsonDecode(saved);
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

  const jsonDecode = (str: string) => {
    return JSON.parse(str);
  };

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
    toast.success("Profile details saved successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg bg-[#FBF8F4] border border-border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 animate-in zoom-in-95"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <User className="size-4.5" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-[#2E2A26] tracking-tight">
                Customer Profile
              </h3>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-lg bg-white/50 hover:bg-white flex items-center justify-center text-muted-foreground hover:text-foreground transition-all border border-border"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 space-y-5">
            <p className="text-xs text-muted-foreground leading-relaxed text-left">
              Save your shipping details here to enable fast, single-click checkout on your next purchase. Details are stored securely on your browser.
            </p>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="text-left space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <User className="size-3 text-primary" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                />
              </div>

              {/* Email Address */}
              <div className="text-left space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3 text-primary" /> Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="text-left space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Phone className="size-3 text-primary" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  />
                </div>

                {/* Pincode */}
                <div className="text-left space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Hash className="size-3 text-primary" /> Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit ZIP"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-11 rounded-xl border border-border bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="text-left space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3 text-primary" /> Full Street Address
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Apartment, House number, street name, city, state"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-md shadow-primary/10"
            >
              <Save className="size-4" /> Save Profile Details
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
