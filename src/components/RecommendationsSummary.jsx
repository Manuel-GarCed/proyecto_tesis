import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RecommendationsSummary({ recommendations = [] }) {
  const navigate = useNavigate()

  const handleClick = (id) => {
    navigate(`/notifications?highlight=${id}`)
  }

  return (
    <div
      className="bg-white rounded-lg shadow flex flex-col h-full">
      {/* === CABECERA FIJA === */}
      <div className="pl-4 pt-3 pb-1">
        <h2 className="text-xl font-semibold m-0">
          Recomendaciones rápidas
        </h2>
      </div>

      {/* === CUERPO SCROLLABLE === */}
      <div className="px-6 py-1.5 overflow-y-auto flex-1">
        <ul className="space-y-2 pr-2">
          {recommendations.map((rec) => (
            <li
              key={rec.id}
              onClick={() => handleClick(rec.id)}
              className="
                cursor-pointer text-cielo hover:text-cielo-claro
                transition-colors"
            >
              • {rec.action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}