/**
 * Temporary placeholder used only during phase 0 scaffolding.
 * Later phases (content-curator, forms-and-pages) replace each page's body
 * with real sourced content and design-system components.
 */
export function PageStub({ title, path }: { title: string; path: string }) {
  return (
    <main className="min-h-screen bg-obsidian-canvas text-snow flex flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="font-inter text-sm uppercase tracking-[0.3em] text-ash">
        route scaffold
      </p>
      <h1 className="text-3xl font-esbuild">{title}</h1>
      <p className="text-snow/60">{path}</p>
    </main>
  )
}
