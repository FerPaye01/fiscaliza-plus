// e:/OSCAR/HACKATONES/osinergmin-dashboard/src/utils/riskEngine.js
import { logSequence } from './utils/logger.js'

/**
 * Risk Intelligence Engine
 * Calculates risk scores based on historical data patterns.
 */
export const riskEngine = {
    /**
     * Calculates the probability of a new breach based on re-incidence
     * @param {Object} entity - The entity to analyze
     * @returns {number} Score from 0 to 100
     */
    calculateScore: (entity) => {
        const history = entity.history || []
        if (history.length === 0) return 10 // Baseline for new agents

        const breaches = history.filter(h => h.result === 'Incumplimiento')
        const totalBreaches = breaches.length

        // Logic:
        // 1. More breaches = higher risk
        // 2. Recent breaches weight more (simplified for this MVP)
        // 3. Re-incidence in same category adds multiplier

        let score = totalBreaches * 25 // 4 breaches = 100 base

        // Cap score
        if (score > 100) score = 100

        return score
    },

    /**
     * Returns a list of entities prioritized by risk
     * @param {Array} entities - List of entities from data.js
     * @returns {Array} Sorted entities with their risk scores
     */
    getPrioritizedAlerts: (entities) => {
        logSequence('Calculando alertas predictivas', 'RiskEngine')

        return entities
            .map(entity => ({
                ...entity,
                riskScore: riskEngine.calculateScore(entity),
                lastBreach: entity.history.find(h => h.result === 'Incumplimiento')?.date || 'N/A'
            }))
            .sort((a, b) => b.riskScore - a.riskScore)
    }
}
