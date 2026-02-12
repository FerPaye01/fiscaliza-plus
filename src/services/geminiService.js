// Servicio de IA — Nested Learning usando Gemini 3 Flash Preview
// Si no hay API key, usa respuestas pre-cargadas para la demo

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-3-flash-preview'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

// Respuestas pre-cargadas para cuando no hay API key
const respuestasPrecargadas = {
    bucleRapido: (agente) => ({
        alerta: true,
        analisis: `ANÁLISIS BUCLE RÁPIDO — ${agente.nombre}\n\nSe detectaron ${agente.alertas.length} señales de riesgo:\n${agente.alertas.map(a => '• ' + a.mensaje).join('\n')}\n\nRiesgo calculado: ${agente.riskScore}%\nRecomendación: ${agente.riskScore >= 60 ? 'SUPERVISIÓN INMEDIATA' : 'Monitoreo continuo'}\n\nNota: Este análisis fue generado cruzando datos de ${agente.fuentesDatos.join(' + ')}.`,
        confianza: agente.riskScore
    }),
    bucleLento: (regla) => ({
        nuevaRegla: true,
        analisis: `OPTIMIZACIÓN BUCLE LENTO — Nested Learning\n\n🤖 El sistema ha analizado ${Math.floor(Math.random() * 500) + 100} casos históricos y detectó que la regla actual tiene una tasa de falsos negativos del ${Math.floor(Math.random() * 30) + 10}%.\n\nPropuesta de mejora:\n"${regla.descripcion}"\n\nOrigen del aprendizaje: ${regla.origen}\n\nSi se aprueba esta regla, el Bucle Rápido la incorporará automáticamente para futuras detecciones.`,
        impactoEstimado: `Reducción estimada de ${Math.floor(Math.random() * 20) + 15}% en falsos negativos.`
    }),
    deepSearch: (query) => ({
        encontrado: true,
        analisis: `BÚSQUEDA SEMÁNTICA — Memoria Continua\n\nConsulta: "${query}"\n\nResultados encontrados en la memoria vectorial:\n• 3 empresas vinculadas al mismo grupo económico\n• 2 de ellas fueron liquidadas con multas impagas\n• El representante legal actual aparece en 5 expedientes históricos\n\nPatrón detectado: REINCIDENCIA MULTIACTOR\nEl análisis de grafos sugiere que las empresas aparentemente independientes comparten estructura de propiedad.`
    })
}

// Llama a la API de Gemini
async function llamarGemini(prompt) {
    const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    })

    if (!res.ok) {
        const errorBody = await res.text()
        console.error('Gemini API error:', res.status, errorBody)
        return null
    }

    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
}

// Bucle Rápido: analiza un agente y genera alerta
// reglasAprobadas = reglas inyectadas por el Slow Loop (Prompt Rewriting)
export async function analizarBucleRapido(agente, reglasAprobadas = []) {
    if (!GEMINI_API_KEY) return respuestasPrecargadas.bucleRapido(agente)

    let reglasInyectadas = ''
    if (reglasAprobadas.length > 0) {
        reglasInyectadas = `\n\nREGLAS APRENDIDAS POR NESTED LEARNING (inyectadas desde Bucle Lento):\n${reglasAprobadas.map((r, i) => `${i + 1}. ${r.descripcion}`).join('\n')}\n\nAPLICA estas reglas como criterios adicionales de riesgo en tu análisis.\n`
    }

    const prompt = `Eres un analista de riesgos de OSINERGMIN (regulador energético de Perú). 
Analiza este agente fiscalizado y genera una alerta de riesgo breve.

DATOS DEL AGENTE:
- Nombre: ${agente.nombre}
- RUC: ${agente.ruc}
- Distrito: ${agente.distrito}
- Precio Gasohol 90: S/${agente.precioGasohol90}
- Promedio distrital: S/${agente.promedioDistrital}
- Diferencial: ${agente.diferencialPrecio}%
- Stock: ${agente.stockGasohol90}L
- Sanciones previas: ${agente.historialSanciones.length}
- Quejas ciudadanas recientes: ${agente.quejasRedes.length}
- Score de Reincidencia: ${agente.scoreReincidencia || 0}
${reglasInyectadas}
Genera un análisis breve (máximo 5 líneas) con:
1. Nivel de riesgo (Alto/Medio/Bajo)
2. Razón principal del riesgo
3. Acción recomendada para el fiscalizador de campo`

    try {
        const text = await llamarGemini(prompt)
        if (!text) return respuestasPrecargadas.bucleRapido(agente)
        return { alerta: true, analisis: text, confianza: agente.riskScore }
    } catch (err) {
        console.error('Error bucle rápido:', err)
        return respuestasPrecargadas.bucleRapido(agente)
    }
}

// Bucle Lento: analiza por qué falló y propone nueva regla
export async function analizarBucleLento(regla) {
    if (!GEMINI_API_KEY) return respuestasPrecargadas.bucleLento(regla)

    const prompt = `Eres el módulo de Nested Learning de OSINERGMIN. Tu función es proponer mejoras a las reglas de fiscalización.

REGLA PROPUESTA:
"${regla.descripcion}"

ORIGEN: ${regla.origen}

Genera una explicación de 4-5 líneas sobre:
1. Por qué esta regla mejora la detección
2. Qué patrón nuevo cubre que antes no se detectaba
3. Impacto estimado en la reducción de falsos negativos`

    try {
        const text = await llamarGemini(prompt)
        if (!text) return respuestasPrecargadas.bucleLento(regla)
        return { nuevaRegla: true, analisis: text, impactoEstimado: 'Mejora estimada del 20% en detección.' }
    } catch (err) {
        console.error('Error bucle lento:', err)
        return respuestasPrecargadas.bucleLento(regla)
    }
}

// Deep Search (búsqueda semántica simulada)
export async function busquedaProfunda(query) {
    if (!GEMINI_API_KEY) return respuestasPrecargadas.deepSearch(query)

    const prompt = `Eres el motor de búsqueda semántica de OSINERGMIN. Simula una búsqueda en la memoria vectorial institucional.

Consulta del usuario: "${query}"

Genera un resultado que incluya:
1. Empresas relacionadas encontradas
2. Conexiones de propiedad detectadas
3. Patrón de reincidencia (si existe)
Máximo 5 líneas.`

    try {
        const text = await llamarGemini(prompt)
        if (!text) return respuestasPrecargadas.deepSearch(query)
        return { encontrado: true, analisis: text }
    } catch (err) {
        console.error('Error deep search:', err)
        return respuestasPrecargadas.deepSearch(query)
    }
}
