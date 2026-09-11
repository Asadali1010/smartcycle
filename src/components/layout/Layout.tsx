import { Outlet } from 'react-router-dom'

/**
 * Root shell. Header/Footer/NavOverlay are added by the design-system and
 * forms-and-pages phases; this stays minimal during scaffolding.
 */
export function Layout() {
  return <Outlet />
}
