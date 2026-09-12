import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatLauncher } from "@/components/chatbot/ChatLauncher";
import { useLenis } from "@/motion/useLenis";

/** Minimal route-transition fallback while a lazy page chunk fetches. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <span className="h-8 w-8 animate-pulse rounded-full bg-current/20" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/**
 * Root shell: fixed Header, routed page content, Footer. Header is
 * position:fixed so every page's first section carries its own top padding
 * (see HeroSection's pt-40/md:pt-48) to clear it; `pt-20` here is a floor
 * for any page/section that doesn't use HeroSection. Every route is
 * code-split (router.tsx) so this Suspense boundary is load-bearing, not
 * decorative — without it a lazy route throws instead of rendering.
 */
export function Layout() {
  useLenis();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ChatLauncher />
    </div>
  );
}
