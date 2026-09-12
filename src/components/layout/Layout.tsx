import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Root shell: fixed Header, routed page content, Footer. Header is
 * position:fixed so every page's first section carries its own top padding
 * (see HeroSection's pt-40/md:pt-48) to clear it; `pt-20` here is a floor
 * for any page/section that doesn't use HeroSection.
 */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
