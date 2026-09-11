import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose, title, children }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
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
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-[#151720] border-t border-border rounded-t-[24px] z-50 overflow-y-auto overscroll-behavior-contain shadow-2xl transition-transform duration-300 animate-in slide-in-from-bottom md:max-w-2xl md:mx-auto md:left-1/2 md:right-auto md:-translate-x-1/2 md:bottom-6 md:rounded-[24px] md:border"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Drag Handle indicator */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-3 mb-2" />

        {/* Header */}
        <div className="px-6 py-3.5 flex items-center justify-between border-b border-border">
          <h3 className="text-base font-bold text-text-primary tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all border border-border"
            aria-label="Close drawer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto pb-12">
          {children}
        </div>
      </div>
    </>
  );
};
