import express, { json } from 'express'
import cors from 'cors'
import csvParser from 'csv-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs, { existsSync, createReadStream, writeFileSync, appendFileSync } from 'fs'
import { stringify } from 'csv-stringify/sync'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const HEADER = 'id,date,water,fertilizer,waste,energy\n';
const COLUMNS = ['id','date','water','fertilizer','waste','energy'];

const CSV_FILE = join(__dirname, 'src', 'data', 'daily_records.csv');

const app = express()
app.use(cors())
app.use(json())

const dataDir = join(__dirname, 'src', 'data');
if (!existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })



// GET ...
app.get('/api/records', (req, res) => {
  const rows = []
  if (!existsSync(CSV_FILE)) return res.json(rows)
  createReadStream(CSV_FILE)
    .pipe(csvParser({ headers: COLUMNS, skipLines: 1 }))
    .on('data', row => rows.push({
      id: Number(row.id),
      date: row.date,
      water: Number(row.water),
      fertilizer: Number(row.fertilizer),
      waste: Number(row.waste),
      energy: Number(row.energy)
    }))
    .on('end', () => res.json(rows))
})

// POST ...
app.post('/api/records', (req, res) => {
  const { date, water, fertilizer, waste, energy } = req.body;
  let all = []

  if (existsSync(CSV_FILE)) {
    createReadStream(CSV_FILE)
      .pipe(csvParser({ headers: ['id','date','water','fertilizer','waste','energy'], skipLines: 1 }))
      .on('data', r => all.push(r))
      .on('end', write)
  } else {
    write()
  }

  function write() {
    const lastId  = all.length ? Math.max(...all.map(r => Number(r.id))) : 0
    const nextId  = lastId + 1
    const row     = { id: nextId, date, water, fertilizer, waste, energy }
    const header  = all.length ? false : true
    const csv     = stringify([ row ], { 
      header,
      columns: COLUMNS,
      record_delimiter: '\n'
    })

    appendFileSync(CSV_FILE, csv)
    res.json(row)
  }
})

// PUT (actualizar)
app.put('/api/records/:id', (req, res) => {
  const idToUpd = Number(req.params.id)
  const { water, fertilizer, waste, energy } = req.body
  const all = []

  createReadStream(CSV_FILE)
    .pipe(csvParser({ headers: ['id','date','water','fertilizer','waste','energy'], skipLines: 1 }))
    .on('data', row => {
      if (Number(row.id) === idToUpd) {
        all.push({ id: row.id, date: row.date, water, fertilizer, waste, energy });
      } else {
        all.push(row)
      }
    })
    .on('end', () => {
      const header = 'id,date,water,fertilizer,waste,energy\n'
      const body = all.map(r => `${r.id},${r.date},${r.water},${r.fertilizer},${r.waste},${r.energy}`).join('\n') + '\n'
      writeFileSync(CSV_FILE, header + body)
      const upd = all.find(r => Number(r.id) === idToUpd)
      res.json({
        id: Number(upd.id),
        date: upd.date,
        water: Number(upd.water),
        fertilizer: Number(upd.fertilizer),
        waste: Number(upd.waste),
        energy: Number(upd.energy),
      })
    })
})

// DELETE (borrar)
app.delete('/api/records/:id', (req, res) => {
  const idToDelete = Number(req.params.id)
  const kept = []

  createReadStream(CSV_FILE)
    .pipe(csvParser({ headers: ['id','date','water','fertilizer','waste','energy'], skipLines: 1 }))
    .on('data', row => {
      if (Number(row.id) !== idToDelete) kept.push(row)
    })
    .on('end', () => {
      const header = 'id,date,water,fertilizer,waste,energy\n'
      const body   = kept.map(r => `${r.id},${r.date},${r.water},${r.fertilizer},${r.waste},${r.energy}`).join('\n') + '\n'
      writeFileSync(CSV_FILE, header + body)
      res.sendStatus(204)
    })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))