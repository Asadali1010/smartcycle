import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement matchMedia at all. Several components (LetterRoll,
// MaskedReveal, and now showcase/timeline/roi) read `prefers-reduced-motion`
// and viewport-width media queries directly via window.matchMedia, so every
// test run needs at least a default stub — individual tests override the
// return value with their own mock as needed.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// jsdom also doesn't implement IntersectionObserver (used by MaskedReveal and
// Framer Motion's whileInView) — a minimal no-op stub is enough for
// component tests that don't specifically assert on scroll-entry timing.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  // @ts-expect-error - partial stub, sufficient for jsdom test environment
  window.IntersectionObserver = IntersectionObserverStub
  // @ts-expect-error - same stub for the global reference some libs check
  globalThis.IntersectionObserver = IntersectionObserverStub
}
