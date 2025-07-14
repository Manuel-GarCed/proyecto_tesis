import { useMemo } from 'react'
import useSensorData from './useSensorData'

export default function useDailyHumidity() {
  const raw = useSensorData()
  return useMemo(() => {
    const map = {}
    for (const row of raw) {
      const d = new Date(row.timestamp)
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (!map[key]) map[key] = { sum:0, count:0 }
      map[key].sum   += Number(row.humedad)
      map[key].count += 1
    }
    return Object.entries(map)
      .map(([date, { sum, count }]) => ({
        date,
        humidity: sum / count
      }))
      .sort((a,b) => new Date(a.date) - new Date(b.date))
  }, [raw])
}