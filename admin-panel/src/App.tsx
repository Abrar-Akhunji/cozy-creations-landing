import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Login } from "./pages/Login";
import { Products } from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Orders } from "./pages/Orders";
import { Coupons } from "./pages/Coupons";
import { LogOut, Package, Folder, ShoppingBag, ShieldCheck, Loader2, Plus, Tag } from "lucide-react";

type Tab = "products" | "categories" | "orders" | "coupons";

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem("krashe_admin_active_tab");
    return (saved as Tab) || "products";
  });

  useEffect(() => {
    localStorage.setItem("krashe_admin_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const emailLower = user.email.toLowerCase();
        setUserEmail(emailLower);
        setAccessDenied(false);
      } else {
        setUserEmail(null);
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setAuthChecking(true);
      await signOut(auth);
      setUserEmail(null);
      setAccessDenied(false);
    } catch (err) {
      console.error("Logout failure:", err);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleAddNew = () => {
    if (activeTab === "products") {
      window.dispatchEvent(new CustomEvent("krashe-add-product"));
    } else if (activeTab === "categories") {
      window.dispatchEvent(new CustomEvent("krashe-add-category"));
    } else if (activeTab === "coupons") {
      window.dispatchEvent(new CustomEvent("krashe-add-coupon"));
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "categories":
        return <Categories />;
      case "orders":
        return <Orders />;
      case "coupons":
        return <Coupons />;
      default:
        return <Products />;
    }
  };

  // 1. Loading Screen
  if (authChecking) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#0d0e12] gap-3">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-text-secondary animate-pulse">
          Validating administrator session security...
        </p>
      </div>
    );
  }

  // 2. Login Screen
  if (!userEmail) {
    return (
      <div className="relative min-h-screen w-screen bg-[#0d0e12]">
        <Login 
          onLoginSuccess={(email) => setUserEmail(email)} 
          accessDenied={accessDenied}
          setAccessDenied={setAccessDenied}
        />
      </div>
    );
  }

  // 3. Authenticated Dashboard Layout
  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#0c0d12] text-text-primary overflow-hidden">
      
      {/* Sidebar Navigation - Desktop only */}
      <aside className="w-64 glass border-r border-border shrink-0 hidden md:flex flex-col justify-between p-5 relative z-20">
        <div className="space-y-8">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-sm leading-none bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                Krashe Admin
              </h1>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-primary block mt-0.5">
                Control Hub
              </span>
            </div>
          </div>

          {/* Navigation Tabs List */}
          <nav className="space-y-1.5">
            {[
              { id: "products", label: "Products Catalog", icon: <Package className="size-4" /> },
              { id: "categories", label: "Categories Manager", icon: <Folder className="size-4" /> },
              { id: "orders", label: "Orders Journal", icon: <ShoppingBag className="size-4" /> },
              { id: "coupons", label: "Coupon Codes", icon: <Tag className="size-4" /> },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full h-11 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all duration-200 text-left ${
                    isActive
                      ? "bg-primary text-[#0d0e12] shadow-lg scale-[1.01]"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Log Out */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <div className="px-2">
            <p className="text-[9px] uppercase tracking-wider font-extrabold text-text-muted">Signed in as</p>
            <p className="text-xs font-semibold text-text-primary truncate mt-0.5" title={userEmail}>
              {userEmail}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full h-10 px-3.5 rounded-xl text-xs font-bold border border-red-500/20 bg-red-950/10 hover:bg-red-950/20 text-red-400 flex items-center gap-3 transition-colors text-left"
          >
            <LogOut className="size-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-[#0d0e12]/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          
          {/* Left Side Header - Logo & Connection dot */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <ShieldCheck className="size-4.5 text-primary" />
              </div>
              <span className="font-bold text-sm tracking-tight text-text-primary">
                Krashe Admin
              </span>
            </div>
            
            {/* Live indicator dot */}
            <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded-full">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] text-green-400 font-extrabold uppercase tracking-wide">Live</span>
            </div>
          </div>

          {/* Right Side Info & Action Buttons */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-text-secondary font-semibold hidden md:inline truncate max-w-[180px]">
              {userEmail}
            </span>
            
            {/* Quick Sign Out */}
            <button
              onClick={handleLogout}
              className="size-9 rounded-lg flex items-center justify-center border border-red-500/25 bg-red-950/15 text-red-400 hover:bg-red-950/25 transition-colors"
              title="Sign Out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Contents Panel */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gradient-to-b from-[#111218]/45 to-transparent pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Floating Action Button (FAB) for mobile quick thumb access */}
      {(activeTab === "products" || activeTab === "categories" || activeTab === "coupons") && (
        <button
          onClick={handleAddNew}
          className="md:hidden fixed bottom-20 right-4 z-40 size-12 rounded-full bg-primary text-[#0d0e12] shadow-2xl flex items-center justify-center transition-transform active:scale-90"
          style={{ boxShadow: "0 8px 24px rgba(217, 119, 6, 0.4)" }}
          aria-label="Add New"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      )}

      {/* Fixed Bottom Navigation - Mobile/Tablet only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0b0e]/95 backdrop-blur-lg border-t border-border flex items-center justify-around px-4 z-40 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
        {[
          { id: "products", label: "Products", icon: <Package className="size-5" /> },
          { id: "categories", label: "Categories", icon: <Folder className="size-5" /> },
          { id: "orders", label: "Orders", icon: <ShoppingBag className="size-5" /> },
          { id: "coupons", label: "Coupons", icon: <Tag className="size-5" /> },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? "text-primary scale-105"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <div className={isActive ? "text-primary" : "text-text-secondary"}>
                {tab.icon}
              </div>
              <span className={`text-[10px] ${isActive ? "font-bold text-primary" : "font-medium text-text-secondary"}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1.5 size-1 rounded-full bg-primary shadow-[0_0_8px_#d97706]" />
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default App;
