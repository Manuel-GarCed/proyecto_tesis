import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RecommendationsSummary({ recommendations = [] }) {
  const navigate = useNavigate()

  const handleClick = (id) => {
    // Vamos a Notifications pasándole el id para destacar
    navigate(`/notifications?highlight=${id}`)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Recomendaciones rápidas</h2>
      <ul className="space-y-2">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            onClick={() => handleClick(rec.id)}
            className="cursor-pointer text-cielo hover:text-cielo-claro transition-colors"
          >
            • {rec.action}
          </li>
        ))}
      </ul>
    </div>
  )
}