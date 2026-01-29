import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-content px-6 md:px-12 py-10 md:py-14">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

export default AppLayout;
