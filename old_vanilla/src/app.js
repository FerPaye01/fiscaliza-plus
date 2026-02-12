// e:/OSCAR/HACKATONES/osinergmin-dashboard/src/app.js
import { logInfo, logSequence } from './utils/logger.js'
import { entities } from './utils/data.js'
import { riskEngine } from './utils/riskEngine.js'

/**
 * Main Application Module
 * Initializes the dashboard and navigation event listeners.
 */
function initApp() {
    logSequence('Inicializando Aplicación', 'Osinergmin Dashboard')

    // Setup Navigation Listeners
    const navItems = document.querySelectorAll('.sidebar-nav li')
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            handleNavigation(item.id)
        })
    })

    // Initial Render
    renderDashboard()

    logInfo('App lista y cargada')
}

/**
 * Renders the predictive risk dashboard
 */
function renderDashboard() {
    const alerts = riskEngine.getPrioritizedAlerts(entities)
    const content = document.getElementById('dynamic-content')

    content.innerHTML = `
        <div class="welcome-header">
            <h1>Sistematización de Inteligencia Fiscalizadora</h1>
            <p>Transformando el conocimiento histórico en acciones preventivas.</p>
        </div>
        
        <div class="stats-row">
            <div class="stat-card glass anim-fade-in">
                <span class="stat-value">${alerts.filter(a => a.riskScore > 70).length}</span>
                <span class="stat-label">Alertas de Alta Prioridad</span>
            </div>
            <div class="stat-card glass anim-fade-in">
                <span class="stat-value">${entities.length}</span>
                <span class="stat-label">Agentes Monitoreados</span>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="card glass full-width">
                <h3>🔍 Ranking de Riesgo Predictivo (Prioridad de Supervisión)</h3>
                <div class="table-container">
                    <table class="risk-table">
                        <thead>
                            <tr>
                                <th>Agente / Entidad</th>
                                <th>Sector</th>
                                <th>Último Incumplimiento</th>
                                <th>Índice de Riesgo</th>
                                <th>Acción Recomendada</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${alerts.map(agent => `
                                <tr>
                                    <td>
                                        <strong>${agent.name}</strong><br>
                                        <small>${agent.location}</small>
                                    </td>
                                    <td><span class="badge badge-${agent.sector.toLowerCase()}">${agent.sector}</span></td>
                                    <td>${agent.lastBreach}</td>
                                    <td>
                                        <div class="risk-bar-container">
                                            <div class="risk-bar" style="width: ${agent.riskScore}%" data-level="${getRiskLevel(agent.riskScore)}"></div>
                                            <span>${agent.riskScore}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn-action ${agent.riskScore > 70 ? 'btn-urgent' : ''}">
                                            ${agent.riskScore > 70 ? '⚠️ Supervisar Ya' : '👁️ Monitorear'}
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
}

function getRiskLevel(score) {
    if (score > 75) return 'high'
    if (score > 40) return 'medium'
    return 'low'
}

/**
 * Handles navigation between dashboard sections
 * @param {string} sectionId - The ID of the clicked nav item
 */
function handleNavigation(sectionId) {
    logSequence('Navegando a sección', sectionId)

    // Update active class in sidebar
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'))
    document.getElementById(sectionId).classList.add('active')

    if (sectionId === 'nav-dashboard') {
        renderDashboard()
    } else {
        document.getElementById('dynamic-content').innerHTML = `<h2>Sección ${sectionId} en desarrollo</h2>`
    }
}

// Start the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp)
