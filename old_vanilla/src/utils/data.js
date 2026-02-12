// e:/OSCAR/HACKATONES/osinergmin-dashboard/src/utils/data.js

export const entities = [
    {
        id: 'E001',
        name: 'Estación de Servicio El Rápido',
        type: 'Grifo',
        sector: 'Hidrocarburos',
        location: 'Lima, Santiago de Surco',
        history: [
            { date: '2025-12-01', type: 'Seguridad', result: 'Incumplimiento', fine: 5000, details: 'Falta de extintores vigentes' },
            { date: '2025-06-15', type: 'Medio Ambiente', result: 'Cumplimiento', fine: 0 },
            { date: '2024-11-20', type: 'Seguridad', result: 'Incumplimiento', fine: 12000, details: 'Fuga detectada en tanque 2' }
        ]
    },
    {
        id: 'E002',
        name: 'Consorcio Eléctrico del Sur',
        type: 'Distribuidora',
        sector: 'Electricidad',
        location: 'Arequipa, Cerro Colorado',
        history: [
            { date: '2025-10-10', type: 'Calidad de Servicio', result: 'Cumplimiento', fine: 0 },
            { date: '2025-01-05', type: 'Seguridad Pública', result: 'Cumplimiento', fine: 0 }
        ]
    },
    {
        id: 'E003',
        name: 'Minera Los Andes S.A.C.',
        type: 'Gran Minería',
        sector: 'Minería',
        location: 'Pasco, Chaupimarca',
        history: [
            { date: '2025-08-22', type: 'Seguridad Minera', result: 'Incumplimiento', fine: 45000, details: 'Falla en sostenimiento de túnel' },
            { date: '2025-02-14', type: 'Seguridad Minera', result: 'Incumplimiento', fine: 30000, details: 'Accidente por falta de EPP' }
        ]
    },
    {
        id: 'E004',
        name: 'Grifos del Norte',
        type: 'Grifo',
        sector: 'Hidrocarburos',
        location: 'Piura, Castilla',
        history: [
            { date: '2025-11-05', type: 'Comercialización', result: 'Incumplimiento', fine: 2000, details: 'Precio no coincide con panel' }
        ]
    },
    {
        id: 'E005',
        name: 'Generación Hidráulica S.A.',
        type: 'Generadora',
        sector: 'Electricidad',
        location: 'Huánuco, Amarilis',
        history: [
            { date: '2025-09-30', type: 'Mantenimiento', result: 'Cumplimiento', fine: 0 },
            { date: '2024-12-12', type: 'Mantenimiento', result: 'Incumplimiento', fine: 8000, details: 'Vibración excesiva en turbina' }
        ]
    }
]
