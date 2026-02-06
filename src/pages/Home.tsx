import { Link } from 'react-router-dom'
import { scoreRegistry } from '../scores/registry'

export default function Home() {
  return (
    <div className="py-6">
      <h1 className="mb-1 text-2xl font-black text-gray-900">Calculateurs</h1>
      <p className="mb-6 text-sm text-gray-500">
        Scores et outils de cardiologie
      </p>

      <div className="flex flex-col gap-3">
        {scoreRegistry.map((score) => (
          <Link
            key={score.id}
            to={`/score/${score.id}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow active:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              {score.icon}
            </span>
            <div className="flex-1">
              <div className="font-bold text-gray-900">{score.name}</div>
              <div className="text-sm text-gray-500">{score.shortDescription}</div>
            </div>
            <span className="text-gray-300">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
