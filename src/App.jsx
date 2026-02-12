import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { normalizarTodos, generarReglasDinamicas, generarRedDinamica } from './services/normalizador.js'
import { analizarBucleRapido, analizarBucleLento, busquedaProfunda } from './services/geminiService.js'
import { reglasAprendidas as reglasDefault, redReincidencia as redDefault } from './data/mockData.js'

// ═══════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════
export default function App() {
    const [vista, setVista] = useState(null)
    const [agentes, setAgentes] = useState([])
    const [ingestaCompleta, setIngestaCompleta] = useState(false)
    const [datosIngesta, setDatosIngesta] = useState(null)
    const [reglasDinamicas, setReglasDinamicas] = useState(reglasDefault.map(r => ({ ...r })))
    const [redDinamica, setRedDinamica] = useState(redDefault)
    const [reglasAprobadas, setReglasAprobadas] = useState([])

    useEffect(() => { setAgentes(normalizarTodos()) }, [])

    // Callback de ingesta: recibe datos reales + rol elegido
    const handleIngestaComplete = (rol, datosReales) => {
        setIngestaCompleta(true)
        if (datosReales) {
            setDatosIngesta(datosReales)
            const agentesNorm = normalizarTodos(datosReales)
            setAgentes(agentesNorm)
            setReglasDinamicas(generarReglasDinamicas(agentesNorm))
            setRedDinamica(generarRedDinamica(agentesNorm))
        }
        setVista(rol)
    }

    const handleReset = () => {
        setVista(null)
        setIngestaCompleta(false)
        setDatosIngesta(null)
        setAgentes(normalizarTodos())
        setReglasDinamicas(reglasDefault.map(r => ({ ...r })))
        setRedDinamica(redDefault)
        setReglasAprobadas([])
    }

    // Prompt Rewriting: Cuando el analista aprueba una regla, se almacena globalmente
    const handleAprobarReglaGlobal = (regla) => {
        setReglasAprobadas(prev => [...prev, regla])
    }

    // Flujo: null → 'ingesta' → rol seleccionado
    if (!vista && !ingestaCompleta) return <PantallaInicio onSelect={(rol) => { setVista(rol) }} onIngesta={() => setVista('ingesta')} />
    if (vista === 'ingesta') return <PantallaIngesta onComplete={handleIngestaComplete} />

    return (
        <div className="app-shell">
            <NavBar vista={vista} onCambiar={(v) => { if (!v) { setIngestaCompleta(false) } setVista(v) }} onReset={handleReset} reglasAprobadas={reglasAprobadas.length} />
            {vista === 'fiscalizador' && <VistaFiscalizador agentes={agentes} reglasAprobadas={reglasAprobadas} />}
            {vista === 'analista' && <VistaAnalista agentes={agentes} reglas={reglasDinamicas} red={redDinamica} onAprobarRegla={handleAprobarReglaGlobal} />}
            {vista === 'direccion' && <VistaDireccion agentes={agentes} />}
        </div>
    )
}

// ═══════════════════════════════════════════
// PANTALLA DE INICIO
// ═══════════════════════════════════════════
function PantallaInicio({ onSelect, onIngesta }) {
    return (
        <div className="inicio-container">
            <div className="inicio-header">
                <h1 className="inicio-title">
                    <span className="logo-fiscali">FISCALI</span><span className="logo-za">ZA</span><span className="logo-plus">+</span>
                </h1>
                <p className="inicio-subtitle">Plataforma de Aprendizaje y Prevención Fiscalizadora</p>
                <p className="inicio-osinergmin">para OSINERGMIN</p>
                <p className="inicio-desc">
                    Plataforma de <a href="https://arxiv.org/pdf/2512.24695" target="_blank" rel="noopener noreferrer" className="nested-link">Nested Learning</a> que ingesta datos en tiempo real de Facilito,
                    SIGED y denuncias ciudadanas. El sistema actualiza automáticamente sus criterios de riesgo
                    ante nuevos patrones de fraude, y detecta reincidencia multiactor.
                </p>
            </div>

            {/* Botón de Ingesta */}
            <button className="btn-ingesta" onClick={onIngesta}>
                ⚡ Ver Proceso de Ingesta y Normalización de Datos
            </button>

            <h2 className="inicio-pregunta">¿Cómo deseas ingresar?</h2>
            <div className="roles-grid">
                <button className="rol-card" onClick={() => onSelect('fiscalizador')}>
                    <span className="rol-emoji">🗺️</span>
                    <h3>Fiscalizador de Campo</h3>
                    <p>Mapa de riesgo en tiempo real. Recibe alertas y "Tarjetas de Misión" con instrucciones precisas de la IA.</p>
                    <span className="rol-tag">OPERATIVO</span>
                </button>
                <button className="rol-card" onClick={() => onSelect('analista')}>
                    <span className="rol-emoji">🧠</span>
                    <h3>Analista de Regulación</h3>
                    <p>Visualiza cómo la IA aprende nuevas reglas. Aprueba o rechaza las mejoras que el sistema propone.</p>
                    <span className="rol-tag">TÁCTICO</span>
                </button>
                <button className="rol-card" onClick={() => onSelect('direccion')}>
                    <span className="rol-emoji">📊</span>
                    <h3>Alta Dirección</h3>
                    <p>Dashboard de impacto institucional. KPIs de prevención, ahorro operativo y reincidencia.</p>
                    <span className="rol-tag">ESTRATÉGICO</span>
                </button>
            </div>
            <div className="inicio-footer">
                <div className="fuentes-tag">Fuentes Integradas:</div>
                <div className="fuentes-list">
                    <span className="fuente-badge">📡 Facilito (CSV)</span>
                    <span className="fuente-badge">📁 SIGED (Expedientes)</span>
                    <span className="fuente-badge">📱 Redes Sociales</span>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════
// PANTALLA DE INGESTA — Fetch real + tabla estilizada + Gemini
// ═══════════════════════════════════════════

// Parsea CSV a array de objetos
function parseCSV(text) {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',')
    return lines.slice(1).map(line => {
        const vals = line.split(',')
        const obj = {}
        headers.forEach((h, i) => { obj[h.trim()] = vals[i]?.trim() || '' })
        return obj
    })
}

// Componente de tabla estilizada expandible
function DataTable({ data, title, icon, maxRows = 5 }) {
    const [expanded, setExpanded] = useState(false)
    if (!data || data.length === 0) return null
    const headers = Object.keys(data[0])
    const rows = expanded ? data : data.slice(0, maxRows)

    return (
        <div className={`data-table-container ${expanded ? 'expanded' : ''}`}>
            <div className="data-table-header" onClick={() => setExpanded(!expanded)}>
                <span>{icon} {title}</span>
                <span className="data-table-meta">
                    <span className="data-table-count">{data.length} registros</span>
                    <span className="data-table-toggle">{expanded ? '▲' : '▼'}</span>
                </span>
            </div>
            <div className="data-table-scroll">
                <table className="data-table">
                    <thead>
                        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                {headers.map(h => {
                                    const val = row[h]
                                    const isNan = val === 'nan'
                                    const isNeg = val === 'negativo'
                                    const isNum = !isNaN(parseFloat(val)) && val.length < 10
                                    return (
                                        <td key={h} className={isNan ? 'cell-nan' : isNeg ? 'cell-neg' : isNum ? 'cell-num' : ''}>
                                            {isNan ? '—' : val}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!expanded && data.length > maxRows && (
                <div className="data-table-more" onClick={() => setExpanded(true)}>
                    ▼ Ver {data.length - maxRows} registros más
                </div>
            )}
        </div>
    )
}

function PantallaIngesta({ onComplete }) {
    const [step, setStep] = useState(0)
    const [log, setLog] = useState([])
    const [dataSources, setDataSources] = useState({})
    const [geminiResult, setGeminiResult] = useState(null)
    const [casoSeleccionado, setCasoSeleccionado] = useState('caso1')
    const logRef = useRef(null)

    const addLog = (msg, type = 'info') => {
        setLog(prev => [...prev, { msg, type, ts: new Date().toLocaleTimeString() }])
    }

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
    }, [log])

    // Genera prompt dinámico a partir de los datos CSV/JSON descargados
    const generarPromptDinamico = (facilito, grifos, siged, redes) => {
        // Resumen de Facilito
        const precios = facilito.filter(f => f.FECHA_CORTE === facilito[0]?.FECHA_CORTE)
        const preciosRegular = precios.map(p => parseFloat(p.G_REGULAR)).filter(v => !isNaN(v))
        const promedio = preciosRegular.length ? (preciosRegular.reduce((a, b) => a + b, 0) / preciosRegular.length).toFixed(2) : '0'
        const anomalias = precios.filter(p => {
            const precio = parseFloat(p.G_REGULAR)
            return !isNaN(precio) && precio > parseFloat(promedio) * 1.10
        })
        const sinStock = precios.filter(p => p.G_REGULAR === 'nan' || p.GNV === 'nan')

        // Resumen de SIGED
        const totalMultas = siged.reduce((s, e) => s + (e.MULTA_SOLES || 0), 0)
        const reincidentes = {}
        siged.forEach(e => { reincidentes[e.RUC] = (reincidentes[e.RUC] || 0) + 1 })
        const rucsReincidentes = Object.entries(reincidentes).filter(([, c]) => c >= 2)

        // Resumen de Redes
        const negativos = redes.filter(r => r.SENTIMIENTO === 'negativo')

        return `Eres el motor de normalización de OSINERGMIN. Analiza estos datos REALES recién descargados de 4 fuentes y genera un resumen ejecutivo de riesgos.

FACILITO (Precios de combustibles):
- ${precios.length} registros descargados del último corte
- Promedio Gasohol Regular: S/${promedio}
- ${anomalias.length} estaciones con precio >10% sobre promedio: ${anomalias.map(a => a.CODIGO_OSINERGMIN + ' (S/' + a.G_REGULAR + ')').join(', ') || 'Ninguna'}
- ${sinStock.length} estaciones con servicios no disponibles (nan)

GRIFOS (Ubicaciones):
- ${grifos.length} establecimientos con coordenadas GPS
- Distritos: ${[...new Set(grifos.map(g => g.DISTRITO))].join(', ')}

SIGED (Expedientes):
- ${siged.length} expedientes históricos
- Total en multas: S/${totalMultas.toLocaleString()}
- ${rucsReincidentes.length} RUCs reincidentes (2+ sanciones): ${rucsReincidentes.map(([ruc, c]) => ruc + ' (' + c + ' sanciones)').join(', ') || 'Ninguno'}
- Estados: ${[...new Set(siged.map(e => e.ESTADO))].join(', ')}

REDES SOCIALES:
- ${redes.length} menciones capturadas
- ${negativos.length} negativas, ${redes.length - negativos.length} positivas
- Zonas mencionadas: ${[...new Set(redes.map(r => r.UBICACION))].join(', ')}
${negativos.length > 0 ? '- Quejas principales: ' + negativos.slice(0, 3).map(n => '"' + n.TEXTO.substring(0, 60) + '..."').join('; ') : ''}

Genera un resumen breve (8-10 líneas) con:
1. Cuántos perfiles de riesgo se generaron
2. Alertas rojas detectadas y por qué
3. Alertas naranjas (predicciones)
4. Red de reincidencia multiactor detectada (si aplica)`
    }

    // Ingesta REAL: fetch de archivos del caso seleccionado + Gemini normaliza
    const runIngesta = async () => {
        const basePath = `/data/${casoSeleccionado}`
        const casoNombres = { caso1: 'Normal', caso2: 'Bajo Riesgo', caso3: 'Crisis' }
        addLog(`📂 CASO SELECCIONADO: ${casoNombres[casoSeleccionado]} (${casoSeleccionado})`, 'system')
        addLog('', 'divider')

        let facilito = [], grifos = [], siged = [], redes = []

        // Paso 1: Facilito CSV
        setStep(1)
        addLog('Conectando con Facilito (datosabiertos.gob.pe)...', 'system')
        await delay(500)
        try {
            const resFac = await fetch(`${basePath}/facilito_precios.csv`)
            const csvFac = await resFac.text()
            facilito = parseCSV(csvFac)
            setDataSources(prev => ({ ...prev, facilito }))
            addLog(`✅ Facilito: ${facilito.length} registros descargados (CSV real)`, 'success')
            addLog(`   Columnas: ${Object.keys(facilito[0]).join(', ')}`, 'detail')
        } catch (e) {
            addLog('⚠ Error descargando Facilito: ' + e.message, 'error')
        }

        // Paso 2: Grifos CSV
        setStep(2)
        await delay(400)
        addLog('Conectando con Registro de Grifos y Estaciones...', 'system')
        try {
            const resGri = await fetch(`${basePath}/grifos_estaciones.csv`)
            const csvGri = await resGri.text()
            grifos = parseCSV(csvGri)
            setDataSources(prev => ({ ...prev, grifos }))
            addLog(`✅ Grifos: ${grifos.length} establecimientos con GPS`, 'success')
            addLog(`   Columnas: ${Object.keys(grifos[0]).join(', ')}`, 'detail')
        } catch (e) {
            addLog('⚠ Error descargando Grifos: ' + e.message, 'error')
        }

        // Paso 3: SIGED JSON
        setStep(3)
        await delay(400)
        addLog('Conectando con SIGED (API de expedientes)...', 'system')
        try {
            const resSig = await fetch(`${basePath}/siged_expedientes.json`)
            siged = await resSig.json()
            setDataSources(prev => ({ ...prev, siged }))
            addLog(`✅ SIGED: ${siged.length} expedientes históricos`, 'success')
            addLog(`   Campos: ${Object.keys(siged[0]).join(', ')}`, 'detail')
        } catch (e) {
            addLog('⚠ Error conectando SIGED: ' + e.message, 'error')
        }

        // Paso 4: Redes JSON
        setStep(4)
        await delay(400)
        addLog('Monitoreando Redes Sociales y Libro de Reclamaciones...', 'system')
        try {
            const resRed = await fetch(`${basePath}/redes_sociales.json`)
            redes = await resRed.json()
            setDataSources(prev => ({ ...prev, redes }))
            addLog(`✅ Redes: ${redes.length} menciones capturadas`, 'success')
            addLog(`   Campos: ${Object.keys(redes[0]).join(', ')}`, 'detail')
        } catch (e) {
            addLog('⚠ Error en stream de redes: ' + e.message, 'error')
        }

        // Paso 5: Gemini normaliza con prompt DINÁMICO
        setStep(5)
        await delay(300)
        addLog('', 'divider')
        addLog('🤖 NORMALIZADOR IA (Gemini 3 Flash Preview) iniciando...', 'ai')
        addLog('   Enviando datos crudos REALES a Gemini para análisis de riesgos...', 'ai')

        try {
            const prompt = generarPromptDinamico(facilito, grifos, siged, redes)

            const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            })
            const data = await res.json()
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || null

            if (aiText) {
                setGeminiResult(aiText)
                addLog('   ✅ Gemini procesó los datos correctamente', 'ai')
            } else {
                addLog('   ⚠ Gemini no respondió, usando normalización local', 'ai')
            }
        } catch (e) {
            addLog('   ⚠ Error en Gemini, usando normalización local', 'ai')
        }

        // Resumen dinámico basado en datos reales
        const alertasRojas = facilito.filter(f => { const p = parseFloat(f.G_REGULAR); return !isNaN(p) && p > 17 }).length
        const alertasNaranjas = facilito.filter(f => { const p = parseFloat(f.G_REGULAR); return !isNaN(p) && p > 15.8 && p <= 17 }).length
        const redesNeg = redes.filter(r => r.SENTIMIENTO === 'negativo').length

        await delay(300)
        addLog('', 'divider')
        addLog('✅ NORMALIZACIÓN COMPLETA', 'success')
        addLog(`   → ${grifos.length} agentes con perfil unificado`, 'success')
        addLog(`   → ${alertasRojas} alertas rojas, ${alertasNaranjas} naranjas`, 'success')
        addLog(`   → ${siged.length} expedientes cruzados, ${redesNeg} quejas negativas`, 'success')
        setStep(6)
    }



    return (
        <div className="ingesta-container">
            <div className="ingesta-header">
                <h2>⚡ Proceso de Ingesta y Normalización</h2>
                <p>El sistema descarga datos reales, los muestra y usa Gemini para generar perfiles de riesgo.</p>
            </div>

            {/* Selector de Casos VISUAL */}
            {step === 0 && (
                <div className="caso-selector-visual">
                    <h3>Selecciona un escenario de datos:</h3>
                    <div className="casos-grid">
                        <div className={`caso-card ${casoSeleccionado === 'caso1' ? 'active' : ''}`} onClick={() => setCasoSeleccionado('caso1')}>
                            <span className="caso-icon">✅</span>
                            <h4>Caso 1: Normal</h4>
                            <p>Operación diaria estándar con 1-2 alertas menores.</p>
                        </div>
                        <div className={`caso-card ${casoSeleccionado === 'caso2' ? 'active' : ''}`} onClick={() => setCasoSeleccionado('caso2')}>
                            <span className="caso-icon">🟢</span>
                            <h4>Caso 2: Bajo Riesgo</h4>
                            <p>Escenario optimista sin alertas ni anomalías detectadas.</p>
                        </div>
                        <div className={`caso-card ${casoSeleccionado === 'caso3' ? 'active' : ''}`} onClick={() => setCasoSeleccionado('caso3')}>
                            <span className="caso-icon">🚨</span>
                            <h4>Caso 3: Crisis</h4>
                            <p>Alertas masivas, colusión de precios y redes de reincidencia.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Diagrama de fuentes */}
            <div className="ingesta-diagram">
                <div className={`source-card ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                    <span className="source-icon">📡</span>
                    <span className="source-name">Facilito</span>
                    <span className="source-format">CSV</span>
                </div>
                <div className={`source-card ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
                    <span className="source-icon">🗺️</span>
                    <span className="source-name">Grifos GIS</span>
                    <span className="source-format">CSV</span>
                </div>
                <div className={`source-card ${step >= 3 ? 'active' : ''} ${step > 3 ? 'done' : ''}`}>
                    <span className="source-icon">📁</span>
                    <span className="source-name">SIGED</span>
                    <span className="source-format">JSON</span>
                </div>
                <div className={`source-card ${step >= 4 ? 'active' : ''} ${step > 4 ? 'done' : ''}`}>
                    <span className="source-icon">📱</span>
                    <span className="source-name">Redes</span>
                    <span className="source-format">JSON</span>
                </div>
                <div className="arrow-down">▼</div>
                <div className={`normalizer-box ${step >= 5 ? 'active' : ''}`}>
                    🤖 Normalizador IA (Gemini Flash 2.5)
                </div>
                <div className="arrow-down">▼</div>
                <div className={`output-box ${step >= 6 ? 'active' : ''}`}>
                    ✅ Perfiles Unificados de Riesgo
                </div>
            </div>

            {/* Área de 2 columnas: terminal + tabla */}
            <div className="ingesta-body">
                {/* Terminal */}
                <div className="ingesta-terminal" ref={logRef}>
                    {log.length === 0 && <div className="terminal-empty">Presiona "Iniciar Ingesta" para comenzar...</div>}
                    {log.map((entry, i) => (
                        entry.type === 'divider' ? <hr key={i} className="terminal-divider" /> :
                            <div key={i} className={`terminal-line ${entry.type}`}>
                                <span className="terminal-ts">[{entry.ts}]</span> {entry.msg}
                            </div>
                    ))}
                </div>

                {/* Tablas de datos */}
                <div className="ingesta-tables">
                    {dataSources.facilito && <DataTable data={dataSources.facilito} title="Facilito — Precios" icon="📡" maxRows={4} />}
                    {dataSources.grifos && <DataTable data={dataSources.grifos} title="Grifos — Ubicaciones" icon="🗺️" maxRows={3} />}
                    {dataSources.siged && <DataTable data={dataSources.siged} title="SIGED — Expedientes" icon="📁" maxRows={3} />}
                    {dataSources.redes && <DataTable data={dataSources.redes} title="Redes — Menciones" icon="📱" maxRows={3} />}
                </div>
            </div>

            {/* Resultado de Gemini */}
            {geminiResult && (
                <div className="gemini-normalization">
                    <h4>🤖 Resultado de Normalización IA (Gemini Flash 2.5):</h4>
                    <pre>{geminiResult}</pre>
                </div>
            )}

            {/* Botones */}
            <div className="ingesta-actions">
                {step === 0 && (
                    <button className="btn-start-ingesta" onClick={runIngesta}>
                        ▶ Iniciar Ingesta de Datos
                    </button>
                )}
                {step === 6 && (
                    <div className="ingesta-done-actions">
                        <button className="btn-go-view" onClick={() => onComplete('fiscalizador', dataSources)}>🗺️ Ver Mapa (Fiscalizador)</button>
                        <button className="btn-go-view" onClick={() => onComplete('analista', dataSources)}>🧠 Ver Reglas (Analista)</button>
                        <button className="btn-go-view" onClick={() => onComplete('direccion', dataSources)}>📊 Ver Dashboard (Dirección)</button>
                    </div>
                )}
            </div>
        </div>
    )
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

// ═══════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════
function NavBar({ vista, onCambiar, onReset, reglasAprobadas }) {
    const vistas = [
        { id: 'fiscalizador', label: '🗺️ Fiscalizador', tag: 'Fast Loop' },
        { id: 'analista', label: '🧠 Analista', tag: 'Slow Loop' },
        { id: 'direccion', label: '📊 Dirección', tag: 'Dashboard' },
    ]
    return (
        <nav className="navbar">
            <div className="nav-logo" onClick={onReset} title="Regresar al inicio y limpiar todo">
                <span className="logo-fiscali">FISCALI</span><span className="logo-za">ZA</span><span className="logo-plus">+</span>
                <span className="logo-sub">Plataforma de Aprendizaje y Prevención Fiscalizadora</span>
            </div>
            <div className="nav-tabs">
                {vistas.map(v => (
                    <button key={v.id} className={`nav-tab ${vista === v.id ? 'active' : ''}`}
                        onClick={() => onCambiar(v.id)}>
                        {v.label}<span className="nav-tag">{v.tag}</span>
                    </button>
                ))}
            </div>
            <div className="nav-actions">
                {reglasAprobadas > 0 && (
                    <span className="reglas-badge" title="Reglas aprendidas esta sesión">🧠 +{reglasAprobadas} reglas inyectadas</span>
                )}
                <button className="btn-reset" onClick={onReset} title="Reiniciar aplicación y borrar datos de ingesta">
                    🔄 Reiniciar Flujo
                </button>
                <div className="nav-status"><span className="status-dot green" /> IA Activa</div>
            </div>
        </nav>
    )
}

// ═══════════════════════════════════════════
// VISTA 1: FISCALIZADOR DE CAMPO
// ═══════════════════════════════════════════
function VistaFiscalizador({ agentes, reglasAprobadas }) {
    const [selected, setSelected] = useState(null)
    const [analisisIA, setAnalisisIA] = useState(null)
    const [cargando, setCargando] = useState(false)

    const handleClick = async (agente) => {
        setSelected(agente)
        setAnalisisIA(null)
        if (agente.riskScore >= 30) {
            setCargando(true)
            const res = await analizarBucleRapido(agente, reglasAprobadas)
            setAnalisisIA(res)
            setCargando(false)
        }
    }

    return (
        <div className="vista-fiscalizador">
            <div className="mapa-container">
                <div className="mapa-leyenda">
                    <h4>Mapa de Riesgo Vivo</h4>
                    <div className="leyenda-items">
                        <span><span className="dot red pulse" /> Alerta Confirmada</span>
                        <span><span className="dot orange pulse" /> Predicción IA</span>
                        <span><span className="dot green" /> Sin Riesgo</span>
                    </div>
                </div>
                <MapContainer center={[-12.06, -77.04]} zoom={12} className="leaflet-map">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    {agentes.map(a => (
                        <CircleMarker key={a.id} center={[a.lat, a.lng]}
                            radius={a.nivelAlerta === 'rojo' ? 14 : a.nivelAlerta === 'naranja' ? 10 : 6}
                            pathOptions={{
                                color: a.nivelAlerta === 'rojo' ? '#e30613' : a.nivelAlerta === 'naranja' ? '#ff9800' : '#00ff9d',
                                fillColor: a.nivelAlerta === 'rojo' ? '#e30613' : a.nivelAlerta === 'naranja' ? '#ff9800' : '#00ff9d',
                                fillOpacity: 0.7
                            }}
                            className={a.nivelAlerta !== 'verde' ? 'marker-pulse' : ''}
                            eventHandlers={{ click: () => handleClick(a) }}>
                            <Popup><strong>{a.nombre}</strong><br />Riesgo: {a.riskScore}%</Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
            <div className="panel-lateral">
                {!selected ? (
                    <div className="panel-vacio"><p>👆 Haz clic en un punto del mapa para ver la Tarjeta de Misión</p></div>
                ) : (
                    <div className="tarjeta-mision">
                        <h3>📋 {selected.nivelAlerta === 'rojo' ? 'ALERTA CONFIRMADA' : selected.nivelAlerta === 'naranja' ? 'PREDICCIÓN IA' : 'MONITOREO'}</h3>
                        <div className={`risk-badge ${selected.nivelAlerta}`}>{selected.riskScore}%</div>
                        <h4>{selected.nombre}</h4>
                        <p className="ruc">RUC: {selected.ruc} · {selected.distrito}</p>
                        <div className="datos-cruzados">
                            <h5>📡 Datos Cruzados de {selected.fuentesDatos.length} Fuentes:</h5>
                            {selected.alertas.map((a, i) => (
                                <div key={i} className={`alerta-item ${a.tipo}`}>
                                    <span className="alerta-fuente">{a.tipo === 'precio' ? 'FACILITO' : a.tipo === 'historial' ? 'SIGED' : a.tipo === 'social' ? 'REDES' : 'FACILITO'}</span>
                                    {a.mensaje}
                                </div>
                            ))}
                        </div>
                        {selected.misionFiscalizador && (
                            <div className="mision-acciones">
                                <h5>🎯 Misión:</h5>
                                <span className={`urgencia ${selected.misionFiscalizador.urgencia.toLowerCase()}`}>{selected.misionFiscalizador.urgencia}</span>
                                <ol>{selected.misionFiscalizador.acciones.map((acc, i) => <li key={i}>{acc}</li>)}</ol>
                            </div>
                        )}
                        {cargando && <div className="ia-loading">🤖 Gemini analizando...</div>}
                        {analisisIA && (
                            <div className="ia-resultado">
                                <h5>🤖 Análisis IA (Bucle Rápido):</h5>
                                {reglasAprobadas && reglasAprobadas.length > 0 && (
                                    <div className="reglas-inyectadas">🧠 +{reglasAprobadas.length} reglas aprendidas inyectadas en este análisis</div>
                                )}
                                <pre>{analisisIA.analisis}</pre>
                            </div>
                        )}
                        {selected.scoreReincidencia !== undefined && (
                            <div className="score-reincidencia">
                                <h5>📊 Score de Reincidencia</h5>
                                <div className="score-bar-container">
                                    <div className="score-bar" style={{ width: `${selected.scoreReincidencia * 100}%`, background: selected.scoreReincidencia > 0.6 ? '#e30613' : selected.scoreReincidencia > 0.3 ? '#ff9800' : '#00ff9d' }}></div>
                                </div>
                                <span className="score-value">{selected.scoreReincidencia.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════
// VISTA 2: ANALISTA DE REGULACIÓN
// ═══════════════════════════════════════════
function VistaAnalista({ agentes, reglas, red, onAprobarRegla }) {
    // Estado local para manejar aprobaciones sin mutar prop
    const [reglasLocales, setReglasLocales] = useState(reglas || [])
    const [analisis, setAnalisis] = useState({})
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResult, setSearchResult] = useState(null)

    // Sincronizar con props cuando cambian (nueva ingesta)
    useEffect(() => {
        if (reglas) setReglasLocales(reglas)
    }, [reglas])

    const handleAprobar = async (id) => {
        setReglasLocales(prev => prev.map(r => r.id === id ? { ...r, estado: 'activa' } : r))
        const regla = reglasLocales.find(r => r.id === id)
        if (onAprobarRegla) onAprobarRegla(regla)
        const res = await analizarBucleLento(regla)
        setAnalisis(prev => ({ ...prev, [id]: res }))
    }

    const handleSearch = async () => {
        if (!searchQuery) return
        const res = await busquedaProfunda(searchQuery)
        setSearchResult(res)
    }

    // Layout simple circular para el grafo dinámico
    const getCoords = (index, total) => {
        if (total === 1) return [200, 150]
        const angle = (index / total) * 2 * Math.PI
        return [200 + 100 * Math.cos(angle), 150 + 100 * Math.sin(angle)]
    }

    return (
        <div className="vista-analista">
            <div className="feed-principal">
                <div className="feed-header">
                    <h2>🧠 Muro de Reglas Vivas</h2>
                    <p>El Bucle Lento del Nested Learning propone mejoras. Tú decides qué se aplica.</p>
                </div>
                <div className="bucle-visual">
                    <div className="bucle-paso"><span className="bucle-num">1</span><span>Bucle Rápido detecta anomalía</span></div>
                    <span className="bucle-flecha">→</span>
                    <div className="bucle-paso"><span className="bucle-num">2</span><span>Bucle Lento analiza el error</span></div>
                    <span className="bucle-flecha">→</span>
                    <div className="bucle-paso"><span className="bucle-num">3</span><span>Propone nueva regla</span></div>
                    <span className="bucle-flecha">→</span>
                    <div className="bucle-paso"><span className="bucle-num">4</span><span>Humano aprueba/rechaza</span></div>
                </div>

                {/* Resumen de Agentes Analizados — Datos de Ingesta */}
                {agentes && agentes.length > 0 && (
                    <div className="agentes-resumen">
                        <h4>📋 Agentes Analizados ({agentes.length} de la ingesta)</h4>
                        <div className="agentes-mini-grid">
                            {agentes.map(a => (
                                <div key={a.id} className={`agente-mini ${a.nivelAlerta}`}>
                                    <div className="agente-mini-head">
                                        <span className={`dot ${a.nivelAlerta} ${a.nivelAlerta !== 'verde' ? 'pulse' : ''}`}></span>
                                        <strong>{a.nombre}</strong>
                                    </div>
                                    <div className="agente-mini-data">
                                        <span>RUC: {a.ruc}</span>
                                        <span>Precio: S/{a.precioGasohol90}</span>
                                        <span>Δ {a.diferencialPrecio}%</span>
                                        <span>Sanciones: {a.historialSanciones.length}</span>
                                        <span>Score: {a.scoreReincidencia?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {reglasLocales.length === 0 && <div className="empty-state">No hay nuevas reglas propuestas.</div>}
                {reglasLocales.map(regla => (
                    <div key={regla.id} className={`regla-card ${regla.estado}`}>
                        <div className="regla-head">
                            <span className="regla-version">{regla.version}</span>
                            <span className={`regla-estado ${regla.estado}`}>
                                {regla.estado === 'activa' ? '✅ APLICADA' : regla.estado === 'rechazada' ? '❌ RECHAZADA' : '⏳ PENDIENTE'}
                            </span>
                        </div>
                        <p className="regla-desc">🤖 "{regla.descripcion}"</p>
                        <p className="regla-origen"><em>Origen: {regla.origen}</em></p>
                        {regla.sustentoLegal && (
                            <p className="regla-legal">📜 <strong>Sustento Legal:</strong> {regla.sustentoLegal}</p>
                        )}
                        {regla.estado === 'pendiente' && (
                            <div className="regla-acciones">
                                <button className="btn-aprobar" onClick={() => handleAprobar(regla.id)}>✅ Aprobar Regla</button>
                                <button className="btn-rechazar" onClick={() => setReglasLocales(prev => prev.map(r => r.id === regla.id ? { ...r, estado: 'rechazada' } : r))}>❌ Rechazar</button>
                            </div>
                        )}
                        {analisis[regla.id] && (
                            <div className="ia-feedback">
                                <h5>🤖 Feedback del Nested Learning:</h5>
                                <pre>{analisis[regla.id].analisis}</pre>
                                <p className="impacto">{analisis[regla.id].impactoEstimado}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="panel-deep-search">
                <h3>🔍 Deep Search: Reincidencia</h3>
                <div className="search-box">
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ej: ¿Este dueño tiene otras empresas sancionadas?"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                    <button onClick={handleSearch}>Buscar</button>
                </div>
                <div className="grafo-container">
                    <svg viewBox="0 0 400 300" className="grafo-svg">
                        {/* Conexiones */}
                        {red && red.conexiones.map((c, i) => {
                            const origen = graphNodes.find(n => n.id === c.origen)
                            const destino = graphNodes.find(n => n.id === c.destino)
                            if (!origen || !destino) return null
                            return (
                                <g key={i}>
                                    <line x1={origen.x} y1={origen.y} x2={destino.x} y2={destino.y}
                                        stroke="rgba(0,210,255,0.2)" strokeWidth="1" strokeDasharray="4" />
                                    <circle cx={(origen.x + destino.x) / 2} cy={(origen.y + destino.y) / 2} r="2" fill="rgba(0,210,255,0.5)">
                                        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            )
                        })}
                        {/* Nodos */}
                        {graphNodes.map(actor => {
                            const color = actor.tipo === 'persona' ? '#00d2ff' : actor.estado === 'liquidada' ? '#e30613' : '#00ff9d'
                            const radius = actor.tipo === 'persona' ? 12 : 8
                            return (
                                <g key={actor.id} className="grafo-node-group">
                                    <circle cx={actor.x} cy={actor.y} r={radius + 4} fill={color} opacity="0.2" className={actor.tipo === 'persona' ? 'pulse-slow' : ''} />
                                    <circle cx={actor.x} cy={actor.y} r={radius} fill={color} />
                                    <text x={actor.x} y={actor.y + 25} textAnchor="middle" fill="#ccc" fontSize="9" fontWeight="bold">{actor.nombre}</text>
                                    {actor.estado === 'liquidada' && <text x={actor.x} y={actor.y + 36} textAnchor="middle" fill="#e30613" fontSize="8" fontWeight="bold">⚠ LIQUIDADA</text>}
                                </g>
                            )
                        })}
                    </svg>
                    <div className="grafo-leyenda">
                        <span><span className="dot-sm blue" /> Persona (Eje)</span>
                        <span><span className="dot-sm green" /> Empresa Activa</span>
                        <span><span className="dot-sm red" /> Empresa Liquidada</span>
                    </div>
                </div>
                {searchResult && <div className="search-result"><pre>{searchResult.analisis}</pre></div>}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════
// VISTA 3: ALTA DIRECCIÓN
// ═══════════════════════════════════════════
function VistaDireccion({ agentes }) {
    const infracciones = agentes.filter(a => a.nivelAlerta !== 'verde').length
    const totalMultas = agentes.reduce((s, a) => s + a.historialSanciones.reduce((ss, h) => ss + h.multa, 0), 0)

    // KPIs Dinámicos
    const agentesVerdes = agentes.filter(a => a.nivelAlerta === 'verde').length
    const ahorroOperativo = agentes.length ? ((agentesVerdes / agentes.length) * 100).toFixed(0) : 0
    const reincidenciaCount = agentes.filter(a => a.historialSanciones.length >= 2).length
    const scorePromedio = agentes.length ? (agentes.reduce((s, a) => s + (a.scoreReincidencia || 0), 0) / agentes.length).toFixed(2) : '0.00'

    // Exportar CSV
    const exportarCSV = () => {
        const headers = ['Código', 'Razón Social', 'RUC', 'Distrito', 'Precio G90', 'Promedio Distrital', 'Diferencial %', 'Stock', 'Nivel Alerta', 'Score Reincidencia', 'Sanciones', 'Quejas', 'Fuentes']
        const rows = agentes.map(a => [
            a.id, a.nombre, a.ruc, a.distrito, a.precioGasohol90, a.promedioDistrital,
            a.diferencialPrecio, a.stockGasohol90, a.nivelAlerta, a.scoreReincidencia || 0,
            a.historialSanciones.length, a.quejasRedes.length, a.fuentesDatos.join('+')
        ])
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `osinergmin_reporte_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Datos para gráfico de barras (simulado con div widths)
    const fuentes = {
        facilito: agentes.filter(a => a.fuentesDatos.includes('Facilito')).length,
        siged: agentes.filter(a => a.fuentesDatos.includes('SIGED')).length,
        redes: agentes.filter(a => a.fuentesDatos.includes('Redes Sociales')).length
    }
    const maxFuente = Math.max(fuentes.facilito, fuentes.siged, fuentes.redes) || 1

    return (
        <div className="vista-direccion">
            <div className="direccion-header">
                <h2>📊 Tablero de Impacto Institucional</h2>
                <div className="filtros">
                    <button className="active">Hoy</button>
                    <button>Semana</button>
                    <button>Mes</button>
                    <button className="btn-exportar" onClick={exportarCSV}>📥 Exportar CSV</button>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-value red">{infracciones}</div>
                    <div className="kpi-label">Infracciones Prevenidas</div>
                    <div className="kpi-desc">Detectadas digitalmente antes del incidente</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value green">{ahorroOperativo}%</div>
                    <div className="kpi-label">Ahorro Operativo</div>
                    <div className="kpi-desc">Fiscalizaciones innecesarias evitadas</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value orange">{reincidenciaCount}</div>
                    <div className="kpi-label">Reincidencia Multiactor</div>
                    <div className="kpi-desc">Redes de informalidad detectadas por Memoria Continua</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value blue">{agentes.length}</div>
                    <div className="kpi-label">Agentes Monitoreados</div>
                    <div className="kpi-desc">En tiempo real desde Facilito + SIGED + Redes</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-value" style={{ color: parseFloat(scorePromedio) > 0.5 ? '#e30613' : parseFloat(scorePromedio) > 0.2 ? '#ff9800' : '#00ff9d' }}>{scorePromedio}</div>
                    <div className="kpi-label">Score Reincidencia Promedio</div>
                    <div className="kpi-desc">Índice compuesto 0-1 basado en sanciones, quejas, precios y stock</div>
                </div>
            </div>

            <div className="charts-row">
                <div className="chart-card">
                    <h4>Detecciones por Fuente de Datos</h4>
                    <div className="bar-chart">
                        <div className="bar-row">
                            <span className="bar-label">Facilito</span>
                            <div className="bar" style={{ width: `${(fuentes.facilito / maxFuente) * 100}%`, background: '#00d2ff' }}>{fuentes.facilito}</div>
                        </div>
                        <div className="bar-row">
                            <span className="bar-label">SIGED</span>
                            <div className="bar" style={{ width: `${(fuentes.siged / maxFuente) * 100}%`, background: '#ff0055' }}>{fuentes.siged}</div>
                        </div>
                        <div className="bar-row">
                            <span className="bar-label">Redes</span>
                            <div className="bar" style={{ width: `${(fuentes.redes / maxFuente) * 100}%`, background: '#00ff9d' }}>{fuentes.redes}</div>
                        </div>
                    </div>
                </div>
                <div className="chart-card">
                    <h4>Evolución de Aprendizaje (Nested Learning)</h4>
                    <div className="line-chart">
                        <svg viewBox="0 0 300 100">
                            <polyline points="0,80 50,75 100,60 150,50 200,30 250,15 300,10"
                                fill="none" stroke="#00d2ff" strokeWidth="2" />
                            <circle cx="0" cy="80" r="3" fill="#00d2ff" />
                            <circle cx="50" cy="75" r="3" fill="#00d2ff" />
                            <circle cx="100" cy="60" r="3" fill="#00d2ff" />
                            <circle cx="150" cy="50" r="3" fill="#00d2ff" />
                            <circle cx="200" cy="30" r="3" fill="#00d2ff" />
                            <circle cx="250" cy="15" r="3" fill="#00d2ff" />
                            <circle cx="300" cy="10" r="3" fill="#00d2ff" />
                        </svg>
                        <div className="chart-labels">
                            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span>
                        </div>
                    </div>
                    <p className="chart-leyenda">Reglas optimizadas vs. Falsos positivos</p>
                </div>
            </div>

            <div className="executive-summary">
                <h3>📑 Resumen Ejecutivo IA</h3>
                <p>
                    El sistema ha procesado <strong>{agentes.length} expedientes</strong> integrando precios de Facilito, historial SIGED y alertas de Redes Sociales.
                    Se ha detectado una red de reincidencia activa con <strong>{reincidenciaCount} actores</strong> involucrados.
                    Score de reincidencia promedio del ecosistema: <strong>{scorePromedio}</strong>.
                    Se recomienda priorizar la fiscalización en los distritos con mayor tasa de anomalías de precios.
                </p>
            </div>
        </div>
    )
}
