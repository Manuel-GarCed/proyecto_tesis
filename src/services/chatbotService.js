// src/services/chatbot.js

/**
 * Motor de chatbot basado en reglas con normalización y coincidencia flexible.
 * Cobertura: saludos, gracias, despedidas, ayuda, humedad/temperatura/pH,
 * acciones (subir/bajar), rangos ideales, riego, notificaciones y recomendaciones,
 * enfermedades (Mildiu, Mosca Blanca, Pulgón).
 *
 * Uso:
 *   import { getBotResponse } from '../services/chatbot';
 *   const text = "¿qué humedad hay?";
 *   const ctx = { latest: {...}, ranges: {...}, notifications: [...], recommendations: [...] };
 *   const reply = await getBotResponse(text, ctx);
 */

/* ========= Utilidades ========= */

const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (t, arr) => arr.some(w => t.includes(w));
const reAny  = (t, res) => res.some(r => r.test(t));

// ------------------------------ GUÍAS ---------------------------------
// Cada guía tiene: title, when, steps[], verify[], cautions[] (todas opcionales)
export const RECO_GUIDES = {
  // 1) “Aumentar frecuencia de riego con sesiones breves (10 min cada 2 h)”
  riego_breve_frecuente: {
    title: 'Riego breve y frecuente (10 min cada 2 h)',
    when:  'Útil ante humedad baja, estrés por calor o suelo muy drenante.',
    steps: [
      'Configura el temporizador de riego a sesiones de ~10 minutos cada 2–3 horas durante el periodo caluroso.',
      'Usa riego por goteo de caudal bajo (1–2 L/h por emisor) para evitar encharcamientos.',
      'Verifica que el agua llegue a la zona radicular (5–10 cm de profundidad).',
      'Reevalúa el patrón al atardecer y ajusta frecuencia si ves exceso/defecto.'
    ],
    verify: [
      'El sustrato se mantiene húmedo al tacto sin charcos.',
      'Las plantas muestran hojas turgentes (sin decaimiento por calor).'
    ],
    cautions: [
      'Evita encharcar; si aparece agua en superficie, reduce minutos o caudal.',
      'En suelos arcillosos, aumenta el intervalo (cada 3–4 h) para permitir oxigenación.'
    ]
  },

  // 2) “Activar sistema de nebulización ligera”
  nebulizacion_ligera: {
    title: 'Nebulización ligera',
    when:  'Para elevar humedad ambiental sin saturar el suelo.',
    steps: [
      'Activa nebulizadores 1–3 minutos cada 30–60 minutos en horas de mayor calor.',
      'Orienta boquillas hacia el pasillo/aire, no directamente al follaje.',
      'Mantén la presión baja para microgotas; evita mojar suelo en exceso.'
    ],
    verify: [
      'Aumento de humedad ambiental sin gotear sobre hojas.',
      'Temperatura percibida ligeramente menor en el microclima.'
    ],
    cautions: [
      'No nebulizar al final de la tarde/noche para evitar hongos.',
      'Si aparece condensación en hojas, reduce duración o frecuencia.'
    ]
  },

  // 3) “Aplicar cal agrícola (subir pH)”
  cal_agricola_subir_ph: {
    title: 'Ajuste de pH: cal agrícola (subir pH)',
    when:  'Cuando el suelo está ácido (pH bajo).',
    steps: [
      'Calcula dosis baja: ~10 g/m² como corrección inicial (evita sobrecorrecciones).',
      'Espolvorea homogéneamente sobre el área y mezcla superficialmente (3–5 cm).',
      'Riega suavemente para activar la reacción.',
      'Espera 48–72 h y vuelve a medir pH; repite en microdosis si aún está bajo.'
    ],
    verify: [
      'pH acercándose al rango objetivo (por ejemplo 6.0–7.0 según cultivo).'
    ],
    cautions: [
      'No aplicar dosis altas de una sola vez.',
      'Evita mezclar simultáneamente con fertilizantes nitrogenados.'
    ]
  },

  // 4) “Azufre elemental (bajar pH)”
  azufre_bajar_ph: {
    title: 'Ajuste de pH: azufre elemental (bajar pH)',
    when:  'Cuando el suelo está básico/alcalino (pH alto).',
    steps: [
      'Aplica microdosis distribuidas: 2–5 g/m² y mezcla superficialmente.',
      'Riega para activar; repite cada 1–2 semanas hasta llegar al rango.',
      'Evita contacto directo con raíces jóvenes (quemaduras).'
    ],
    verify: [
      'pH bajando gradualmente hacia el objetivo.'
    ],
    cautions: [
      'No aplicar dosis grandes de golpe; cambios lentos son más seguros.',
      'Usa guantes y evita inhalación de polvo.'
    ]
  },

  // 5) “Cobertura vegetal / mantas térmicas”
  mantas_termicas_o_sombreo: {
    title: 'Mantas térmicas o malla de sombreo',
    when:  'Para proteger ante temperaturas extremas (altas o bajas).',
    steps: [
      'Para calor: instala malla de sombreo 30–50% en las horas de mayor radiación.',
      'Para frío: coloca manta térmica por la noche; retírala al amanecer.',
      'Asegura buena ventilación para evitar acumulación de humedad bajo la cubierta.'
    ],
    verify: [
      'Reducción de estrés térmico (hojas menos caídas a mediodía).'
    ],
    cautions: [
      'No exceder el sombreo: puede reducir fotosíntesis.',
      'Evita que la manta toque directamente brotes tiernos.'
    ]
  },

  // 6) “Acolchado/mulch”
  acolchado: {
    title: 'Acolchado (mulch) para conservar humedad',
    when:  'Para reducir evaporación y estabilizar temperatura del suelo.',
    steps: [
      'Aplica capa de 3–5 cm de paja, hojas secas o compost maduro alrededor de las plantas (sin tocar tallo).',
      'Revisa semanalmente y repone material perdido.',
      'Mantén el goteo debajo del acolchado para máxima eficiencia.'
    ],
    verify: [
      'Suelo húmedo por más tiempo y menor oscilación térmica.'
    ],
    cautions: [
      'Evita acolchado muy grueso que impida aireación.',
      'No usar material fresco con semillas (riesgo de malezas).'
    ]
  },

  // 7) “Reducir riego y ventilar (humedad alta / riesgo de hongos)”
  reducir_riego_y_ventilar: {
    title: 'Reducir riego y mejorar ventilación',
    when:  'Cuando hay humedad alta o riesgo de hongos.',
    steps: [
      'Disminuye tiempos de riego y aumenta intervalo entre sesiones.',
      'Abre ventanas/laterales para generar flujo de aire.',
      'Evita mojar follaje; riega directo al suelo.',
      'Retira hojas muy mojadas o con signos de hongos.'
    ],
    verify: [
      'Menos condensación y secado rápido post-riego.'
    ],
    cautions: [
      'No cortes riego en exceso si hay calor intenso (estrés hídrico).'
    ]
  },
};

// Palabras clave → guía
const TOPIC_ALIAS = [
  { key: 'riego_breve_frecuente',   kw: ['riego breve', 'riego frecuente', '10 minutos', 'cada 2 horas', 'aumentar frecuencia de riego'] },
  { key: 'nebulizacion_ligera',     kw: ['nebulizacion', 'nebulización', 'nebulizar'] },
  { key: 'cal_agricola_subir_ph',   kw: ['cal agricola', 'cal agrícola', 'subir ph', 'elevar ph'] },
  { key: 'azufre_bajar_ph',         kw: ['azufre', 'bajar ph', 'acidificar'] },
  { key: 'mantas_termicas_o_sombreo', kw: ['manta termica', 'manta térmica', 'sombreo', 'malla de sombreo', 'mantas termicas'] },
  { key: 'acolchado',               kw: ['acolchado', 'mulch', 'cobertura vegetal'] },
  { key: 'reducir_riego_y_ventilar', kw: ['reducir riego', 'ventilar', 'hongos', 'humedad alta'] },
];

// Si te pasan ctx.recommendations, deduce la guía desde su texto
function matchGuideFromRecommendationText(text = '') {
  const t = normalize(text);
  for (const { key, kw } of TOPIC_ALIAS) {
    if (kw.some(k => t.includes(normalize(k)))) return key;
  }
  // reglas por variable/direccion genérica
  if (t.includes('temperatura supero') || t.includes('critico') || t.includes('alto 35')) {
    return 'mantas_termicas_o_sombreo';
  }
  if (t.includes('temperatura descendio') || t.includes('debajo del rango')) {
    return 'mantas_termicas_o_sombreo';
  }
  if (t.includes('humedad descendio') || t.includes('menor al 60')) {
    return 'riego_breve_frecuente';
  }
  if (t.includes('humedad supero') || t.includes('mas del 80') || t.includes('riesgo de hongos')) {
    return 'reducir_riego_y_ventilar';
  }
  if (t.includes('ph') && (t.includes('acido') || t.includes('acida') || t.includes('menor a 5.5'))) {
    return 'cal_agricola_subir_ph';
  }
  if (t.includes('ph alto') || t.includes('basico') || t.includes('alcalino')) {
    return 'azufre_bajar_ph';
  }
  return null;
}

function formatGuide(guide) {
  const g = RECO_GUIDES[guide];
  if (!g) return 'No tengo una guía para ese tema todavía.';
  const lines = [];
  lines.push(`**${g.title}**`);
  if (g.when)     lines.push(`Cuándo usarla: ${g.when}`);
  if (g.steps?.length) {
    lines.push('Pasos:');
    lines.push('• ' + g.steps.join('\n• '));
  }
  if (g.verify?.length) {
    lines.push('Verifica:');
    lines.push('• ' + g.verify.join('\n• '));
  }
  if (g.cautions?.length) {
    lines.push('Precauciones:');
    lines.push('• ' + g.cautions.join('\n• '));
  }
  return lines.join('\n');
}

// ---------------------------- DETECTORES -------------------------------
function numberFromText(t) {
  const m = t.match(/#?(\d{1,3})\b/);
  return m ? Number(m[1]) : undefined;
}

function matchGuideKeyFromText(t) {
  // Intenciones por problema
  if (hasAny(t, ['humedad alta', 'hongos', 'exceso de humedad'])) return 'reducir_riego_y_ventilar';
  if (hasAny(t, ['humedad baja', 'subir la humedad'])) return 'riego_breve_frecuente';
  if (hasAny(t, ['temperatura alta', 'mucho calor'])) return 'mantas_termicas_o_sombreo';
  if (hasAny(t, ['temperatura baja', 'mucho frio', 'mucho frío'])) return 'mantas_termicas_o_sombreo';
  if (hasAny(t, ['subir ph', 'elevar ph'])) return 'cal_agricola_subir_ph';
  if (hasAny(t, ['bajar ph', 'acidificar'])) return 'azufre_bajar_ph';

  // Intenciones por acción concreta
  for (const { key, kw } of TOPIC_ALIAS) {
    if (kw.some(k => t.includes(normalize(k)))) return key;
  }
  return null;
}

// ----------------------------- API PÚBLICA -----------------------------
/**
 * Devuelve una respuesta de guía de recomendaciones.
 * @param {string} text  Pregunta del usuario
 * @param {object} ctx   Opcional: { recommendations: [{id, text}] }
 * @returns {Promise<string>}
 */
export async function getBotResponse(text, ctx = {}) {
  const t = normalize(text);

  // Listar temas disponibles
  if (hasAny(t, ['temas', 'ayuda recomendaciones', 'recomendaciones disponibles', 'que recomendaciones'])) {
    const names = Object.values(RECO_GUIDES).map(g => `• ${g.title}`).join('\n');
    return `Puedo guiarte en:\n${names}\n\nPídeme por ejemplo: "¿cómo aplicar cal agrícola?", "guíame con nebulización", "¿qué hago con humedad alta?" o "explica la recomendación #2".`;
  }

  // “explica/mostrar recomendación #n” (usa ctx.recommendations)
  if (hasAny(t, ['recomendacion', 'recomendación', 'recomendaciones']) && hasAny(t, ['explica', 'explicame', 'mostrar', 'detalle', 'ver'])) {
    const id = numberFromText(t);
    if (id != null && Array.isArray(ctx.recommendations)) {
      const rec = ctx.recommendations.find(r => Number(r.id) === id) || ctx.recommendations[id - 1];
      if (!rec) return 'No encontré esa recomendación.';
      const key = matchGuideFromRecommendationText(rec.text || '');
      return key ? formatGuide(key) : `No pude mapear esa recomendación a una guía conocida.\n\nTexto: ${rec.text}`;
    }
    return 'Indícame el número: por ejemplo “explica la recomendación #2”.';
  }

  // “qué hago con … / guíame / cómo …”
  if (hasAny(t, ['que hago', 'guiame', 'guíame', 'como', 'cómo'])) {
    const key = matchGuideKeyFromText(t);
    if (key) return formatGuide(key);
  }

  // Peticiones directas por nombre (“cal agrícola”, “nebulización”, etc.)
  const directKey = matchGuideKeyFromText(t);
  if (directKey) return formatGuide(directKey);

  // Fallback
  const names = Object.values(RECO_GUIDES).map(g => `• ${g.title}`).join('\n');
  return `Puedo guiarte en estas recomendaciones:\n${names}\n\nDime, por ejemplo: "¿cómo usar malla de sombreo?", "necesito bajar el pH", "tengo humedad alta", "explica la recomendación #1".`;
}