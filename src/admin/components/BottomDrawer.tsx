import React, { useEffect, useRef } from "react";

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose, title, children }) => {
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
        className="admin-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="admin-drawer-container"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Drag Handle */}
        <div className="admin-drawer-handle" />

        {/* Header */}
        <div
          style={{
            padding: "16px 20px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--admin-border)",
          }}
        >
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--admin-text)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--admin-border)",
              background: "transparent",
              color: "var(--admin-text-muted)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              fontSize: 16,
              lineHeight: 1,
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-surface)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text-muted)";
            }}
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "16px 20px 32px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomDrawer;
