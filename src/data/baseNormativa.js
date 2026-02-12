// Base de datos normativa simulada de OSINERGMIN
// Artículos del Reglamento de Registro de Hidrocarburos y Tipificación de Infracciones

export const baseNormativa = [
    {
        id: 'ART_001',
        articulo: 'Art. 76° - Reglamento de Comercialización de Combustibles',
        titulo: 'Obligación de publicar precios',
        descripcion: 'Todo establecimiento de venta al público de combustibles debe exhibir en lugar visible los precios de venta vigentes de todos los combustibles que comercializa.',
        tipificacion: 'Infracción Leve',
        sancion_uit: 3,
        keywords: ['precio', 'publicar', 'exhibir', 'transparencia']
    },
    {
        id: 'ART_002',
        articulo: 'Art. 79° - Reglamento de Comercialización de Combustibles',
        titulo: 'Prohibición de adulteración',
        descripcion: 'Queda prohibido adulterar, contaminar o mezclar combustibles líquidos con otros productos que alteren su calidad o composición certificada.',
        tipificacion: 'Infracción Muy Grave',
        sancion_uit: 20,
        keywords: ['adulteración', 'mezcla', 'calidad', 'contaminación']
    },
    {
        id: 'ART_003',
        articulo: 'Art. 83° - Reglamento de Registro de Hidrocarburos',
        titulo: 'Manipulación de equipos de medición',
        descripcion: 'Está prohibida la manipulación de surtidores, medidores volumétricos u otros equipos de despacho que alteren la cantidad entregada al consumidor.',
        tipificacion: 'Infracción Grave',
        sancion_uit: 12,
        keywords: ['surtidor', 'manipulación', 'medición', 'calibración', 'despacho']
    },
    {
        id: 'ART_004',
        articulo: 'Art. 85° - Reglamento de Seguridad de Hidrocarburos',
        titulo: 'Incumplimiento de normas de seguridad',
        descripcion: 'Todo agente registrado debe cumplir con las normas técnicas de seguridad para almacenamiento, transporte y despacho de combustibles.',
        tipificacion: 'Infracción Grave',
        sancion_uit: 8,
        keywords: ['seguridad', 'incumplimiento', 'almacenamiento', 'norma técnica']
    },
    {
        id: 'ART_005',
        articulo: 'Art. 90° - Tipificación de Infracciones OSINERGMIN',
        titulo: 'Negativa injustificada de venta',
        descripcion: 'Constituye infracción negar la venta de combustibles al público sin causa justificada, incluida la alegación de falta de stock cuando existen existencias disponibles.',
        tipificacion: 'Infracción Grave',
        sancion_uit: 10,
        keywords: ['negativa', 'venta', 'stock', 'denegación', 'servicio', 'especulación']
    },
    {
        id: 'ART_006',
        articulo: 'Art. 95° - Tipificación de Infracciones OSINERGMIN',
        titulo: 'Diferencial de precios fraudulento',
        descripcion: 'Cuando el precio cobrado al consumidor difiere del precio publicado en el sistema Facilito o en el panel visible del establecimiento, constituyendo engaño al consumidor.',
        tipificacion: 'Infracción Grave',
        sancion_uit: 15,
        keywords: ['precio', 'diferencial', 'fraude', 'Facilito', 'sobreprecio', 'colusión']
    },
    {
        id: 'ART_007',
        articulo: 'Art. 102° - Reglamento de Registro de Hidrocarburos',
        titulo: 'Reincidencia sancionadora',
        descripcion: 'La reincidencia en infracciones del mismo tipo dentro de un período de 4 años constituye agravante y faculta la cancelación del Registro de Hidrocarburos.',
        tipificacion: 'Agravante - Cancelación de Registro',
        sancion_uit: 50,
        keywords: ['reincidencia', 'historial', 'cancelación', 'registro', 'agravante']
    },
    {
        id: 'ART_008',
        articulo: 'Art. 108° - Reglamento de Registro de Hidrocarburos',
        titulo: 'Cambio fraudulento de razón social',
        descripcion: 'Se presume fraude cuando un agente cancela su registro y posteriormente un nuevo agente con los mismos accionistas, representantes legales o dirección solicita un nuevo registro para evadir sanciones pendientes.',
        tipificacion: 'Infracción Muy Grave',
        sancion_uit: 30,
        keywords: ['razón social', 'cambio', 'accionistas', 'representante legal', 'fraude', 'evasión']
    }
]

// Busca el artículo más relevante para un tipo de infracción/patrón detectado
export function buscarSustentoLegal(keywords) {
    let mejorMatch = null
    let mejorScore = 0

    for (const norma of baseNormativa) {
        const score = norma.keywords.reduce((acc, kw) => {
            return acc + (keywords.some(k => k.toLowerCase().includes(kw) || kw.includes(k.toLowerCase())) ? 1 : 0)
        }, 0)
        if (score > mejorScore) {
            mejorScore = score
            mejorMatch = norma
        }
    }

    return mejorMatch || baseNormativa[0]
}
