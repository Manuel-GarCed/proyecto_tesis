import express from 'express';
import { existsSync, mkdirSync, createReadStream, appendFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';         // <— importamos fileURLToPath
import csvParser from 'csv-parser';
import { stringify } from 'csv-stringify/sync';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Reconstruimos __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
const CSV_FILE = join(dataDir, 'daily_records.csv');


// GET /api/records → devuelve JSON con todos los registros
app.get('/api/records', (req, res) => {
  const rows = [];
  if (!existsSync(CSV_FILE)) return res.json(rows);
  createReadStream(CSV_FILE)
    .pipe(csvParser({ headers: ['id','date','water','fertilizer','waste'] }))
    .on('data', row => {
      rows.push({
        id:         Number(row.id),
        date:       row.date,
        water:      Number(row.water),
        fertilizer: Number(row.fertilizer),
        waste:      Number(row.waste),
      });
    })
    .on('end', () => res.json(rows));
});

// POST /api/records → añade un registro al CSV y lo devuelve
app.post('/api/records', (req, res) => {
  const { date, water, fertilizer, waste } = req.body;
  let all = [];

  // Leemos para obtener el último ID
  if (existsSync(CSV_FILE)) {
    createReadStream(CSV_FILE)
      .pipe(csvParser({ headers: ['id','date','water','fertilizer','waste'] }))
      .on('data', r => all.push(r))
      .on('end', writeRecord);
  } else {
    writeRecord();
  }

  function writeRecord() {
    const lastId = all.length ? Math.max(...all.map(r => Number(r.id))) : 0;
    const nextId = lastId + 1;
    const row    = { id: nextId, date, water, fertilizer, waste };
    // Si no existe el CSV, incluimos cabecera
    const csv = stringify([row], {
      header:  all.length === 0,
      columns: ['id','date','water','fertilizer','waste']
    });
    appendFileSync(CSV_FILE, csv);
    res.json(row);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});