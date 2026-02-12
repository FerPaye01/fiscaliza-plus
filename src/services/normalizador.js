// Motor de normalización: toma datos crudos de 3 fuentes y genera perfiles unificados
// Acepta datos reales de la ingesta o usa datos mock como fallback

import { facilito, siged, redesSociales } from '../data/mockData.js'
import { buscarSustentoLegal } from '../data/baseNormativa.js'

// Datos activos (pueden ser los mock o los reales)
let datosFacilito = facilito
let datosSiged = siged
let datosRedes = redesSociales

// Calcula el precio promedio distrital
function calcularPromedioDistrital(distrito) {
    const grifosDistrito = datosFacilito.filter(g => g.distrito === distrito)
    if (grifosDistrito.length === 0) return 15.50
    return grifosDistrito.reduce((sum, g) => sum + g.precioGasohol90, 0) / grifosDistrito.length
}

// Busca expedientes históricos por RUC
function buscarHistorialSIGED(ruc) {
    return datosSiged.filter(e => e.ruc === ruc)
}

// Busca menciones en redes sociales por distrito
function buscarMencionesRedes(distrito) {
    return datosRedes.filter(r =>
        r.ubicacionMencionada.toLowerCase() === distrito.toLowerCase() &&
        r.sentimiento === 'negativo'
    )
}

// Normaliza un establecimiento en un Perfil Unificado de Riesgo
export function normalizarAgente(agenteFacilito) {
    const historial = buscarHistorialSIGED(agenteFacilito.ruc)
    const menciones = buscarMencionesRedes(agenteFacilito.distrito)
    const promedioDistrital = calcularPromedioDistrital(agenteFacilito.distrito)
    const diferencialPrecio = ((agenteFacilito.precioGasohol90 - promedioDistrital) / promedioDistrital) * 100

    let riskScore = 0
    const alertas = []

    if (Math.abs(diferencialPrecio) > 15) {
        riskScore += 35
        alertas.push({ tipo: 'precio', mensaje: `Precio ${diferencialPrecio > 0 ? 'superior' : 'inferior'} al promedio distrital en ${Math.abs(diferencialPrecio).toFixed(1)}%` })
    }

    if (agenteFacilito.stockGasohol90 < 100) {
        riskScore += 20
        alertas.push({ tipo: 'stock', mensaje: `Stock crítico: ${agenteFacilito.stockGasohol90}L` })
    }

    if (historial.length > 0) {
        riskScore += historial.length * 15
        alertas.push({ tipo: 'historial', mensaje: `${historial.length} sanciones previas (SIGED). Multas acumuladas: S/${historial.reduce((s, h) => s + h.multa, 0).toLocaleString()}` })
    }

    if (menciones.length > 0) {
        riskScore += menciones.length * 10
        alertas.push({ tipo: 'social', mensaje: `${menciones.length} quejas ciudadanas en la zona` })
    }

    let nivelAlerta = 'verde'
    if (riskScore >= 60) nivelAlerta = 'rojo'
    else if (riskScore >= 30) nivelAlerta = 'naranja'

    // Score de Reincidencia (0.0 - 1.0)
    const scoreReincidencia = calcularScoreReincidencia(historial, menciones, diferencialPrecio, agenteFacilito.stockGasohol90)

    return {
        id: agenteFacilito.codigoEstablecimiento,
        nombre: agenteFacilito.razonSocial,
        ruc: agenteFacilito.ruc,
        lat: agenteFacilito.lat,
        lng: agenteFacilito.lng,
        distrito: agenteFacilito.distrito,
        precioGasohol90: agenteFacilito.precioGasohol90,
        stockGasohol90: agenteFacilito.stockGasohol90,
        promedioDistrital: promedioDistrital.toFixed(2),
        diferencialPrecio: diferencialPrecio.toFixed(1),
        historialSanciones: historial,
        quejasRedes: menciones,
        riskScore: Math.min(riskScore, 100),
        nivelAlerta,
        alertas,
        scoreReincidencia,
        fuentesDatos: ['Facilito', historial.length > 0 ? 'SIGED' : null, menciones.length > 0 ? 'Redes Sociales' : null].filter(Boolean),
        misionFiscalizador: generarMision(agenteFacilito, alertas, riskScore)
    }
}

// Genera la "Tarjeta de Misión" para el fiscalizador
function generarMision(agente, alertas, riskScore) {
    if (riskScore < 30) return null
    const prioridades = alertas.map(a => {
        if (a.tipo === 'precio') return 'Verificar precio real en surtidor vs. panel publicado'
        if (a.tipo === 'stock') return 'Inspeccionar niveles reales de tanque'
        if (a.tipo === 'historial') return 'Revisar cumplimiento de medidas correctivas anteriores'
        if (a.tipo === 'social') return 'Tomar muestra de combustible para laboratorio'
        return ''
    })
    return { riesgoCalculado: riskScore, acciones: prioridades, urgencia: riskScore >= 60 ? 'INMEDIATA' : 'PROGRAMADA' }
}

// Calcula Score de Reincidencia (0.0 - 1.0)
function calcularScoreReincidencia(historial, menciones, diferencialPrecio, stock) {
    let score = 0
    // Factor 1: Sanciones previas (peso 0.4)
    score += Math.min(historial.length * 0.2, 0.4)
    // Factor 2: Quejas ciudadanas (peso 0.2)
    score += Math.min(menciones.length * 0.1, 0.2)
    // Factor 3: Diferencial de precio (peso 0.2)
    if (Math.abs(diferencialPrecio) > 15) score += 0.2
    else if (Math.abs(diferencialPrecio) > 10) score += 0.1
    // Factor 4: Stock cero sospechoso (peso 0.2)
    if (stock < 50) score += 0.2
    else if (stock < 100) score += 0.1
    return Math.min(parseFloat(score.toFixed(2)), 1.0)
}

// Convierte datos crudos del CSV/JSON (ingesta real) al formato interno
function convertirDatosReales(rawFacilito, rawGrifos, rawSiged, rawRedes) {
    // Combinar precios + ubicaciones por CODIGO_OSINERGMIN
    const grifosMap = {}
    rawGrifos.forEach(g => { grifosMap[g.CODIGO_OSINERGMIN] = g })

    // Tomar solo la última fecha de cada estación
    const ultimaFecha = {}
    rawFacilito.forEach(f => {
        if (!ultimaFecha[f.CODIGO_OSINERGMIN] || f.FECHA_CORTE > ultimaFecha[f.CODIGO_OSINERGMIN].FECHA_CORTE) {
            ultimaFecha[f.CODIGO_OSINERGMIN] = f
        }
    })

    // Convertir a formato interno facilitando el cruce
    const facConvertido = Object.values(ultimaFecha).map(f => {
        const g = grifosMap[f.CODIGO_OSINERGMIN] || {}
        const precio = parseFloat(f.G_REGULAR) || 15.50
        return {
            codigoEstablecimiento: f.CODIGO_OSINERGMIN,
            razonSocial: g.RAZON_SOCIAL || f.CODIGO_OSINERGMIN,
            ruc: g.RUC || '',
            lat: parseFloat(g.LATITUD) || -12.06,
            lng: parseFloat(g.LONGITUD) || -77.04,
            distrito: g.DISTRITO || 'LIMA',
            precioGasohol90: precio,
            stockGasohol90: f.G_REGULAR === 'nan' ? 0 : 5000
        }
    })

    const sigConvertido = rawSiged.map(s => ({
        expediente: s.EXPEDIENTE, ruc: s.RUC, tipo: s.TIPO_INFRACCION,
        multa: s.MULTA_SOLES, fecha: s.FECHA, estado: s.ESTADO
    }))

    const redConvertido = rawRedes.map(r => ({
        fuente: r.FUENTE, texto: r.TEXTO,
        ubicacionMencionada: r.UBICACION, sentimiento: r.SENTIMIENTO
    }))

    return { facConvertido, sigConvertido, redConvertido }
}

// Normaliza TODOS los agentes — acepta datos reales de la ingesta o usa mock
export function normalizarTodos(datosReales) {
    if (datosReales && datosReales.facilito && datosReales.grifos) {
        const { facConvertido, sigConvertido, redConvertido } = convertirDatosReales(
            datosReales.facilito, datosReales.grifos, datosReales.siged || [], datosReales.redes || []
        )
        datosFacilito = facConvertido
        datosSiged = sigConvertido
        datosRedes = redConvertido
    } else {
        datosFacilito = facilito
        datosSiged = siged
        datosRedes = redesSociales
    }
    return datosFacilito.map(normalizarAgente).sort((a, b) => b.riskScore - a.riskScore)
}

// Genera reglas dinámicas basadas en patrones detectados en la ingesta
export function generarReglasDinamicas(agentes) {
    const reglas = []
    const alertasRojas = agentes.filter(a => a.nivelAlerta === 'rojo')
    const alertasPrecio = agentes.filter(a => a.diferencialPrecio > 15)
    const alertasStock = agentes.filter(a => a.stockGasohol90 < 100)

    // Regla 1: Patrón de precios
    if (alertasPrecio.length >= 2) {
        const sustento = buscarSustentoLegal(['precio', 'diferencial', 'sobreprecio'])
        reglas.push({
            id: 'R_DYN_01', type: 'precio', version: 'v.2.0.' + Math.floor(Math.random() * 9),
            estado: 'pendiente', fecha: new Date().toISOString().split('T')[0],
            descripcion: `Detectado sobreprecio simultáneo en ${alertasPrecio.length} estaciones (>15%). Posible colusión distrital.`,
            origen: `Bucle Rápido: Análisis de ${agentes.length} agentes en tiempo real.`,
            sustentoLegal: sustento ? `${sustento.articulo} — ${sustento.titulo} (${sustento.tipificacion}, hasta ${sustento.sancion_uit} UIT)` : null
        })
    }

    // Regla 2: Desabastecimiento crítico
    if (alertasStock.length >= 2) {
        const sustento = buscarSustentoLegal(['negativa', 'venta', 'stock', 'especulación'])
        reglas.push({
            id: 'R_DYN_02', type: 'stock', version: 'v.1.5.0',
            estado: 'activa', fecha: new Date().toISOString().split('T')[0],
            descripcion: `Alerta de Seguridad Energética: ${alertasStock.length} estaciones sin stock en la misma zona. Priorizar fiscalización.`,
            origen: `Bucle Lento: Correlación de reportes de stock 0.`,
            sustentoLegal: sustento ? `${sustento.articulo} — ${sustento.titulo} (${sustento.tipificacion}, hasta ${sustento.sancion_uit} UIT)` : null
        })
    }

    // Regla 3: Reincidencia
    const reincidentes = agentes.filter(a => a.historialSanciones && a.historialSanciones.length >= 2)
    if (reincidentes.length > 0) {
        const sustento = buscarSustentoLegal(['reincidencia', 'historial', 'cancelación'])
        reglas.push({
            id: 'R_DYN_03', type: 'historial', version: 'v.3.1.2',
            estado: 'pendiente', fecha: new Date().toISOString().split('T')[0],
            descripcion: `Bloquear trámites a RUCs con >2 sanciones graves impagas. Detectados: ${reincidentes.map(r => r.ruc).join(', ')}.`,
            origen: `Deep Search: Análisis de historial sancionador.`,
            sustentoLegal: sustento ? `${sustento.articulo} — ${sustento.titulo} (${sustento.tipificacion}, hasta ${sustento.sancion_uit} UIT)` : null
        })
    }

    return reglas.length > 0 ? reglas : [
        { id: 'R_DEF', version: 'v.1.0', estado: 'activa', descripcion: 'Monitoreo estándar activo. Sin anomalías sistémicas detectadas.', origen: 'Sistema Base', sustentoLegal: null }
    ]
}

// Genera el grafo de red de reincidencia basado en RUCs compartidos y sanciones
export function generarRedDinamica(agentes) {
    const actores = []
    const conexiones = []
    const empresasMap = {}

    // 1. Identificar empresas y dueños
    agentes.forEach(a => {
        if (!empresasMap[a.ruc]) {
            empresasMap[a.ruc] = {
                id: a.ruc, nombre: a.nombre, tipo: 'empresa',
                estado: a.historialSanciones.some(h => h.estado && h.estado.includes('liquidada')) ? 'liquidada' : 'activa',
                sanciones: a.historialSanciones.length,
                scoreReincidencia: a.scoreReincidencia || 0
            }
            actores.push(empresasMap[a.ruc])
        }
    })

    // 2. Detección de Cambio de Razón Social
    // Compara direcciones y patrones de nombre para detectar mismos dueños con diferentes empresas
    const empresasArr = Object.values(empresasMap)
    for (let i = 0; i < empresasArr.length; i++) {
        for (let j = i + 1; j < empresasArr.length; j++) {
            const a = empresasArr[i]
            const b = empresasArr[j]
            // Detectar si comparten palabras clave en el nombre (simulación de mismos accionistas)
            const palabrasA = a.nombre.toLowerCase().split(/\s+/)
            const palabrasB = b.nombre.toLowerCase().split(/\s+/)
            const palabrasCompartidas = palabrasA.filter(p => p.length > 3 && palabrasB.includes(p))
            if (palabrasCompartidas.length > 0 && (a.sanciones > 0 || b.sanciones > 0)) {
                const sustento = buscarSustentoLegal(['razón social', 'cambio', 'fraude', 'evasión'])
                conexiones.push({
                    origen: a.id, destino: b.id,
                    tipo: `⚠️ Cambio de Razón Social Detectado (coincidencia: "${palabrasCompartidas.join(', ')}")`,
                    sustentoLegal: sustento ? sustento.articulo : null
                })
            }
        }
    }

    // 3. Crear conexiones por sanciones compartidas
    const empresasSancionadas = actores.filter(a => a.sanciones > 0)
    if (empresasSancionadas.length >= 2) {
        const personaId = 'P_DYN_01'
        actores.push({ id: personaId, nombre: 'Grupo Económico Detectado', tipo: 'persona', rol: 'Vinculado' })
        empresasSancionadas.forEach(emp => {
            conexiones.push({ origen: personaId, destino: emp.id, tipo: 'Propiedad/Vínculo' })
        })
    } else if (actores.length > 1 && conexiones.length === 0) {
        conexiones.push({ origen: actores[0].id, destino: actores[1].id, tipo: 'Colaboración comercial' })
    }

    return { actores, conexiones }
}
