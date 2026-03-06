import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { scoreRegistry } from '../scores/registry'

export type LayoutContext = {
  setOnReset: (fn: (() => void) | null) => void
}

export default function Layout() {
  const [onReset, setOnReset] = useState<(() => void) | null>(null)

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 px-4 py-3 backdrop-blur-md">
        <NavLink to="/" className="text-xl font-black tracking-tight text-gray-900">
          Cardio<span className="text-primary">Score</span>
        </NavLink>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 active:bg-gray-200"
          >
            Reset
          </button>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-24" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
        <Outlet context={{ setOnReset }} />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/90 backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`
            }
          >
            <span className="text-lg">🏠</span>
            Accueil
          </NavLink>
          {scoreRegistry.map((s) => (
            <NavLink
              key={s.id}
              to={`/score/${s.id}`}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`
              }
            >
              <span className="text-lg">{s.icon}</span>
              {s.shortName}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Disclaimer */}
      <div className="fixed z-20 pointer-events-none left-0 right-0" style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
        <p className="mx-auto max-w-lg px-4 text-center text-[10px] text-gray-300">
          Usage informatif uniquement — ne remplace pas le jugement clinique
        </p>
      </div>
    </div>
  )
}
