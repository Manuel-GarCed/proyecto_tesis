import express, { json } from 'express'
import { existsSync, createReadStream, appendFileSync } from 'fs'
import { join } from 'path'
import csvParser from 'csv-parser'
import { stringify } from 'csv-stringify/sync'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(json())

// Ahora sí _join_ usará __dirname si renombramos este archivo a server.cjs,
// o bien obtenlo a mano:
// const __dirname = new URL('.', import.meta.url).pathname
const CSV_FILE = join(process.cwd(), 'src', 'data', 'daily_records.csv')

app.get('/api/records', (req, res) => {
  const rows = []
  if (!existsSync(CSV_FILE)) return res.json(rows)

  // Sin pasar `headers` ni `skipLines`: por defecto
  // csv-parser usa la 1ª línea como cabecera y la salta.
  createReadStream(CSV_FILE)
    .pipe(csvParser())
    .on('data', r => {
      rows.push({
        id:         Number(r.id),
        date:       r.date,
        water:      Number(r.water),
        fertilizer: Number(r.fertilizer),
        waste:      Number(r.waste),
      })
    })
    .on('end', () => res.json(rows))
})

app.post('/api/records', (req, res) => {
  const { date, water, fertilizer, waste } = req.body
  let all = []

  function write() {
    const lastId = all.length
      ? Math.max(...all.map(r => Number(r.id)))
      : 0
    const nextId = lastId + 1
    const row    = { id: nextId, date, water, fertilizer, waste }
    // stringify añade correctamente la cabecera sólo si header=true
    const csv = stringify([row], {
      header: all.length === 0,
      columns: ['id','date','water','fertilizer','waste'],
      record_delimiter: '\n'
    })
    appendFileSync(CSV_FILE, csv)
    res.json(row)
  }

  if (existsSync(CSV_FILE)) {
    createReadStream(CSV_FILE)
      .pipe(csvParser())
      .on('data', r => all.push(r))
      .on('end', write)
  } else {
    write()
  }
})

const port = process.env.PORT || 4000
app.listen(port, () =>
  console.log(`Server escuchando en http://localhost:${port}`)
)