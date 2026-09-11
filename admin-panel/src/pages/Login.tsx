import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ShieldCheck, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, ShieldAlert } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (email: string) => void;
  accessDenied: boolean;
  setAccessDenied: (val: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, accessDenied, setAccessDenied }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAccessDenied(false);
    setLoading(true);

    try {
      const emailTrimmed = email.trim().toLowerCase();
      const userCredential = await signInWithEmailAndPassword(auth, emailTrimmed, password);
      const user = userCredential.user;
      
      if (user && user.email) {
        onLoginSuccess(emailTrimmed);
      } else {
        throw new Error("Invalid user authentication credentials.");
      }
    } catch (err: unknown) {
      console.error("Email login failure: ", err);
      const firebaseError = err as { code?: string; message?: string };
      let msg = "Invalid admin email or password.";
      
      if (firebaseError.code === "auth/invalid-credential" || firebaseError.code === "auth/wrong-password" || firebaseError.code === "auth/user-not-found") {
        msg = "Invalid admin email or password.";
      } else if (firebaseError.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please try again later.";
      } else if (firebaseError.message) {
        msg = firebaseError.message;
      }
      
      if (!accessDenied) {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0c0d12] via-[#12141c] to-[#0a0a0d] p-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 size-[380px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-[380px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-border">
        
        {/* Whitelist Denied Banner */}
        {accessDenied && (
          <div className="flex items-start gap-3 bg-red-950/40 border border-red-500/30 backdrop-blur-md rounded-2xl p-4 mb-6 text-sm text-red-200 animate-in fade-in slide-in-from-top duration-300">
            <ShieldAlert className="size-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-400">Security Access Denied</p>
              <p className="text-xs text-red-200/80 mt-0.5 leading-relaxed">
                Your email is not authorized on the "Krashe Admin" Firestore whitelist. Please contact the database owner to grant access.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="size-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-2 shadow-inner border border-primary/15">
            <ShieldCheck className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-text-primary via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
            Krashe Admin
          </h1>
          <p className="text-text-secondary text-sm">
            Boutique Crochet E-commerce Control Panel
          </p>
        </div>

        {/* Error Callout (non-whitelist related errors) */}
        {error && !accessDenied && (
          <div className="flex items-start gap-3 bg-red-950/40 border border-red-500/30 rounded-xl p-3.5 mb-6 text-sm text-red-200 animate-in fade-in duration-200">
            <AlertCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={loading}
                className="w-full h-12 rounded-xl glass-input px-11 text-sm placeholder:text-text-muted"
                placeholder="admin@krashe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Security Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                className="w-full h-12 rounded-xl glass-input pl-11 pr-12 text-sm placeholder:text-text-muted"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-md"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-[#0d0e12] font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? (
              <span className="size-5 border-2 border-[#0d0e12] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="size-4" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Security Warning Notice */}
        <p className="text-[10px] text-text-muted text-center mt-8 leading-relaxed">
          Access is restricted to authorized credentials created inside the Firebase Console. Whitelist verification matches against Firestore.
        </p>

      </div>
    </div>
  );
};
