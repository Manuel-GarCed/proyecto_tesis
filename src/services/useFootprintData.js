import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function useFootprintData(csvPath = '/huellaxdia.csv') {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(csvPath)
      .then((res) => res.text())
      .then((csvText) => {
        const { data: rows } = Papa.parse(csvText, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          dynamicTyping: false, // desactivamos dynamicTyping porque limpiamos manual
        });

        const map = {};
        rows.forEach((row) => {
          // 1) parsear fecha dd/mm/yyyy → ISO
          const [d, m, y] = row.fecha.trim().split('/');
          const dateObj = new Date(+y, +m - 1, +d);
          const iso = dateObj.toISOString().slice(0, 10);

          // 2) limpiar y parsear la columna de ha
          let raw = String(row['ha (ese dia)']).trim();
          // reemplaza comas por puntos, elimina comas sobrantes finales
          raw = raw.replace(/,/g, '.').replace(/\.+$/, '');
          const ha = parseFloat(raw);

          // 3) periodo
          const per = row.Periodo.trim().toLowerCase().startsWith('a')
            ? 'Antes'
            : 'Después';

          if (!map[iso]) map[iso] = { fecha: iso };
          map[iso][per] = ha;
        });

        // ordenar y volcar a array
        const chartData = Object.values(map).sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );
        setData(chartData);
      })
      .catch((err) => {
        console.error('Error cargando huella ecológica:', err);
      });
  }, [csvPath]);

  return data;
}