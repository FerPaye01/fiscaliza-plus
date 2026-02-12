// Datos crudos simulados — Formato REAL de OSINERGMIN
// Estos son los datos "tal como vienen" de cada fuente, antes de normalizar

// ═══════════════════════════════════════════
// FUENTE 1: FACILITO (CSV de Precios Diarios)
// Formato real: datosabiertos.gob.pe
// ═══════════════════════════════════════════
export const facilito_raw = `FECHA_CORTE,NOMBRE_LOCAL,G_PREMIUM,G_REGULAR,DIESEL,GNV,GLP_G,GLP_E
2026-02-11,EST_SERV_001,17.20,15.49,14.80,2.15,7.90,38.50
2026-02-11,EST_SERV_002,19.90,18.50,16.20,nan,nan,nan
2026-02-11,EST_SERV_003,15.60,15.60,14.90,2.10,8.10,39.00
2026-02-11,EST_SERV_004,17.25,15.55,14.85,nan,7.80,37.00
2026-02-11,EST_SERV_005,20.50,19.00,17.00,nan,nan,nan`

// ═══════════════════════════════════════════
// FUENTE 2: GRIFOS Y ESTACIONES (CSV de Registro)
// Formato real: datosabiertos.gob.pe
// ═══════════════════════════════════════════
export const grifos_raw = `CODIGO_OSINERGMIN,RAZON_SOCIAL,RUC,DEPARTAMENTO,PROVINCIA,DISTRITO,DIRECCION,LATITUD,LONGITUD,TIPO_ESTABLECIMIENTO
EST_SERV_001,Estación San Isidro S.A.C.,20451234567,LIMA,LIMA,SAN ISIDRO,Av. Javier Prado 450,-12.097,-77.036,ESTACION DE SERVICIO
EST_SERV_002,Grifos del Norte E.I.R.L.,20567891234,LIMA,LIMA,LA MOLINA,Av. La Molina 1230,-12.075,-76.945,GRIFO
EST_SERV_003,Corporación Fuel Power S.A.,20612345678,CALLAO,CALLAO,CALLAO,Av. Argentina 890,-12.055,-77.085,ESTACION DE SERVICIO
EST_SERV_004,Servicentro El Rápido S.R.L.,20698765432,LIMA,LIMA,SANTIAGO DE SURCO,Av. Caminos del Inca 230,-12.120,-77.010,GRIFO
EST_SERV_005,Inversiones Mejía & Hijos,20543219876,LIMA,LIMA,COMAS,Av. Túpac Amaru 5670,-11.955,-77.065,GRIFO`

// ═══════════════════════════════════════════
// FUENTE 3: SIGED (Expedientes — Formato simulado)
// Sistema interno, no público
// ═══════════════════════════════════════════
export const siged_raw = [
    {
        EXPEDIENTE: 'EXP-2024-00451', RUC: '20567891234', RAZON_SOCIAL: 'Grifos del Norte E.I.R.L.',
        TIPO_INFRACCION: 'Adulteración de combustible', MULTA_UIT: 10, MULTA_SOLES: 45000,
        FECHA: '2024-06-15', ESTADO: 'Ejecutada', RESOLUCION: 'RES-2024-312', TIPO_PROC: 'NO TUPA'
    },
    {
        EXPEDIENTE: 'EXP-2023-01892', RUC: '20567891234', RAZON_SOCIAL: 'Grifos del Norte E.I.R.L.',
        TIPO_INFRACCION: 'Precio no publicado', MULTA_UIT: 3, MULTA_SOLES: 12000,
        FECHA: '2023-11-20', ESTADO: 'Ejecutada', RESOLUCION: 'RES-2023-987', TIPO_PROC: 'TUPA'
    },
    {
        EXPEDIENTE: 'EXP-2022-00234', RUC: '20999888777', RAZON_SOCIAL: 'Combustibles Norte S.A.',
        TIPO_INFRACCION: 'Venta sin licencia', MULTA_UIT: 18, MULTA_SOLES: 80000,
        FECHA: '2022-03-10', ESTADO: 'Empresa liquidada', RESOLUCION: 'RES-2022-156', TIPO_PROC: 'NO TUPA'
    },
    {
        EXPEDIENTE: 'EXP-2025-00078', RUC: '20543219876', RAZON_SOCIAL: 'Inversiones Mejía & Hijos',
        TIPO_INFRACCION: 'Manipulación de surtidores', MULTA_UIT: 12, MULTA_SOLES: 55000,
        FECHA: '2025-01-28', ESTADO: 'En apelación', RESOLUCION: 'RES-2025-045', TIPO_PROC: 'NO TUPA'
    },
    {
        EXPEDIENTE: 'EXP-2024-01567', RUC: '20612345678', RAZON_SOCIAL: 'Corporación Fuel Power S.A.',
        TIPO_INFRACCION: 'Incumplimiento de seguridad', MULTA_UIT: 5, MULTA_SOLES: 25000,
        FECHA: '2024-09-05', ESTADO: 'Ejecutada', RESOLUCION: 'RES-2024-789', TIPO_PROC: 'TUPA'
    },
]

// ═══════════════════════════════════════════
// FUENTE 4: REDES SOCIALES / DENUNCIAS
// ═══════════════════════════════════════════
export const redes_raw = [
    {
        ID: 'TW-20260211-001', FUENTE: 'Twitter/X', TEXTO: 'El grifo de La Molina cobra S/18.50 pero en Facilito dice S/15. ¡ESTAFA! @Abordo @OSINERGMIN',
        FECHA: '2026-02-11T04:30:00', UBICACION: 'La Molina', SENTIMIENTO: 'negativo'
    },
    {
        ID: 'TW-20260211-002', FUENTE: 'Twitter/X', TEXTO: 'Fui a cargar gasolina en Comas y me dijeron que no hay stock. Llevan 3 días así.',
        FECHA: '2026-02-11T03:15:00', UBICACION: 'Comas', SENTIMIENTO: 'negativo'
    },
    {
        ID: 'FB-20260210-001', FUENTE: 'Facebook', TEXTO: 'Cuidado con el grifo de la Av. Javier Prado, el combustible huele raro y rinde menos.',
        FECHA: '2026-02-10T18:00:00', UBICACION: 'San Isidro', SENTIMIENTO: 'negativo'
    },
    {
        ID: 'LR-20260211-001', FUENTE: 'Libro de Reclamaciones', TEXTO: 'Diferencia de precio en panel vs. surtidor de S/2.00. Solicito investigación.',
        FECHA: '2026-02-11T01:00:00', UBICACION: 'La Molina', SENTIMIENTO: 'negativo'
    },
    {
        ID: 'TW-20260211-003', FUENTE: 'Twitter/X', TEXTO: 'Grifo de Surco excelente servicio y precios justos 👍 #BuenServicio',
        FECHA: '2026-02-11T05:00:00', UBICACION: 'Santiago de Surco', SENTIMIENTO: 'positivo'
    },
]

// ═══════════════════════════════════════════
// DATOS YA NORMALIZADOS (resultado del proceso de ingesta)
// ═══════════════════════════════════════════
export const facilito = [
    {
        codigoEstablecimiento: 'EST_SERV_001', razonSocial: 'Estación San Isidro S.A.C.', ruc: '20451234567',
        precioGasohol90: 15.49, precioGasohol95: 17.20, precioDiesel: 14.80, stockGasohol90: 2500,
        lat: -12.097, lng: -77.036, distrito: 'San Isidro', ultimaActualizacion: '2026-02-11T06:00:00'
    },
    {
        codigoEstablecimiento: 'EST_SERV_002', razonSocial: 'Grifos del Norte E.I.R.L.', ruc: '20567891234',
        precioGasohol90: 18.50, precioGasohol95: 19.90, precioDiesel: 16.20, stockGasohol90: 0,
        lat: -12.075, lng: -76.945, distrito: 'La Molina', ultimaActualizacion: '2026-02-11T05:30:00'
    },
    {
        codigoEstablecimiento: 'EST_SERV_003', razonSocial: 'Corporación Fuel Power S.A.', ruc: '20612345678',
        precioGasohol90: 15.60, precioGasohol95: 15.60, precioDiesel: 14.90, stockGasohol90: 1800,
        lat: -12.055, lng: -77.085, distrito: 'Callao', ultimaActualizacion: '2026-02-11T06:10:00'
    },
    {
        codigoEstablecimiento: 'EST_SERV_004', razonSocial: 'Servicentro El Rápido S.R.L.', ruc: '20698765432',
        precioGasohol90: 15.55, precioGasohol95: 17.25, precioDiesel: 14.85, stockGasohol90: 3200,
        lat: -12.120, lng: -77.010, distrito: 'Santiago de Surco', ultimaActualizacion: '2026-02-11T06:05:00'
    },
    {
        codigoEstablecimiento: 'EST_SERV_005', razonSocial: 'Inversiones Mejía & Hijos', ruc: '20543219876',
        precioGasohol90: 19.00, precioGasohol95: 20.50, precioDiesel: 17.00, stockGasohol90: 50,
        lat: -11.955, lng: -77.065, distrito: 'Comas', ultimaActualizacion: '2026-02-10T22:00:00'
    },
]

export const siged = [
    {
        expediente: 'EXP-2024-00451', ruc: '20567891234', razonSocial: 'Grifos del Norte E.I.R.L.',
        tipoInfraccion: 'Adulteración de combustible', multa: 45000, fecha: '2024-06-15',
        estado: 'Ejecutada', resolucion: 'RES-2024-312'
    },
    {
        expediente: 'EXP-2023-01892', ruc: '20567891234', razonSocial: 'Grifos del Norte E.I.R.L.',
        tipoInfraccion: 'Precio no publicado', multa: 12000, fecha: '2023-11-20',
        estado: 'Ejecutada', resolucion: 'RES-2023-987'
    },
    {
        expediente: 'EXP-2022-00234', ruc: '20999888777', razonSocial: 'Combustibles Norte S.A.',
        tipoInfraccion: 'Venta sin licencia', multa: 80000, fecha: '2022-03-10',
        estado: 'Empresa liquidada', resolucion: 'RES-2022-156'
    },
    {
        expediente: 'EXP-2025-00078', ruc: '20543219876', razonSocial: 'Inversiones Mejía & Hijos',
        tipoInfraccion: 'Manipulación de surtidores', multa: 55000, fecha: '2025-01-28',
        estado: 'En apelación', resolucion: 'RES-2025-045'
    },
    {
        expediente: 'EXP-2024-01567', ruc: '20612345678', razonSocial: 'Corporación Fuel Power S.A.',
        tipoInfraccion: 'Incumplimiento de seguridad', multa: 25000, fecha: '2024-09-05',
        estado: 'Ejecutada', resolucion: 'RES-2024-789'
    },
]

export const redesSociales = [
    {
        id: 'TW-001', fuente: 'Twitter/X', texto: 'El grifo de La Molina cobra S/18.50 pero en Facilito dice S/15. ¡ESTAFA!',
        fecha: '2026-02-11T04:30:00', ubicacionMencionada: 'La Molina', sentimiento: 'negativo'
    },
    {
        id: 'TW-002', fuente: 'Twitter/X', texto: 'Fui a cargar gasolina en Comas y me dijeron que no hay stock. Llevan 3 días así.',
        fecha: '2026-02-11T03:15:00', ubicacionMencionada: 'Comas', sentimiento: 'negativo'
    },
    {
        id: 'FB-001', fuente: 'Facebook', texto: 'Cuidado con el grifo de la Av. Javier Prado, el combustible huele raro.',
        fecha: '2026-02-10T18:00:00', ubicacionMencionada: 'San Isidro', sentimiento: 'negativo'
    },
    {
        id: 'DEN-001', fuente: 'Libro de Reclamaciones', texto: 'Diferencia de precio en panel vs. surtidor de S/2.00.',
        fecha: '2026-02-11T01:00:00', ubicacionMencionada: 'La Molina', sentimiento: 'negativo'
    },
    {
        id: 'TW-003', fuente: 'Twitter/X', texto: 'Grifo de Surco excelente servicio y precios justos 👍',
        fecha: '2026-02-11T05:00:00', ubicacionMencionada: 'Santiago de Surco', sentimiento: 'positivo'
    },
]

// Red de reincidencia
export const redReincidencia = {
    actores: [
        { id: 'P1', nombre: 'Juan Mejía Rojas', tipo: 'persona', rol: 'Dueño' },
        { id: 'E1', nombre: 'Inversiones Mejía & Hijos', ruc: '20543219876', tipo: 'empresa', estado: 'activa' },
        { id: 'E2', nombre: 'Combustibles Norte S.A.', ruc: '20999888777', tipo: 'empresa', estado: 'liquidada' },
        { id: 'E3', nombre: 'Grifos del Norte E.I.R.L.', ruc: '20567891234', tipo: 'empresa', estado: 'activa' },
        { id: 'P2', nombre: 'María Mejía Torres', tipo: 'persona', rol: 'Representante Legal' },
    ],
    conexiones: [
        { origen: 'P1', destino: 'E1', tipo: 'Accionista mayoritario' },
        { origen: 'P1', destino: 'E2', tipo: 'Ex-gerente general' },
        { origen: 'P2', destino: 'E3', tipo: 'Representante Legal' },
        { origen: 'P2', destino: 'E1', tipo: 'Accionista minoritaria' },
        { origen: 'P1', destino: 'P2', tipo: 'Familiar directo' },
    ]
}

export const reglasAprendidas = [
    {
        id: 'R001', version: 'v.42.1', fecha: '2026-02-10', estado: 'activa',
        descripcion: 'Si un grifo reporta stock 0 por más de 24h Y existen quejas en redes sociales de la misma zona → Elevar a Alerta Naranja.',
        origen: 'Patrón detectado en 12 casos de especulación durante feriados 2025.'
    },
    {
        id: 'R002', version: 'v.43.0', fecha: '2026-02-11', estado: 'pendiente',
        descripcion: 'Si el precio reportado en Facilito difiere >15% del promedio distrital Y el RUC tiene historial SIGED → Elevar a Alerta Roja.',
        origen: 'Correlación detectada entre diferencial de precios y sanciones previas por adulteración.'
    },
    {
        id: 'R003', version: 'v.44.0', fecha: '2026-02-11', estado: 'pendiente',
        descripcion: 'Si una empresa liquidada con multas impagas comparte representante legal con una empresa activa → Marcar como Reincidencia Multiactor.',
        origen: 'Algoritmo de grafos detectó 3 redes de informalidad ocultas en el último trimestre.'
    },
]
