import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-obsidian-canvas text-snow flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-display">Page not found</h1>
      <Link to="/" className="text-ember-pulse underline underline-offset-4">
        Back to homepage
      </Link>
    </main>
  )
}
