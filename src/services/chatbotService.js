/**
 * Lista de patrones y sus respuestas.
 * Cada entrada es [ Array<string|RegExp> patrones, string respuesta ]
 */
const rules = [
  [
    // intenciones de riego
    [/regar/i, /agua/i, /riego?/i],
    'Según las últimas lecturas, te recomiendo aplicar 200 mL de agua cada mañana.'
  ],
  [
    // humedad
    [/humedad/i, /moisture/i],
    'La humedad actual es del 45 %. Podrías esperar un poco antes de regar.'
  ],
  [
    // pH
    [/pH/i, /ph[^a-z]/i],
    'El pH actual es 6.8, dentro del rango óptimo (6.5 – 7.5).'
  ]
];

/**
 * Procesa el texto del usuario y devuelve la mejor respuesta.
 * Si no encaja con nada, devuelve un fallback.
 * @param {string} text
 * @returns {Promise<string>}
 */
export async function getBotResponse(text) {
  const t = text.trim();
  for (const [patterns, answer] of rules) {
    if (patterns.some(p => (p instanceof RegExp ? p.test(t) : t.includes(p)))) {
      return answer;
    }
  }
  return 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?';
}