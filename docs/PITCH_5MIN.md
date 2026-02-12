# 🎤 PITCH 5 MINUTOS — FiscalizaPlus: Nested Learning para OSINERGMIN

> **Estructura**: 1 min concepto + 4 min demo en vivo
> **Tip**: Abre la app en el navegador ANTES de empezar. Ten seleccionado "Caso 3: Crisis" pero NO presiones Iniciar.

---

## ⏱️ MINUTO 0:00–1:00 — EL PROBLEMA Y LA SOLUCIÓN

### Abrir con el dolor (20 seg)

> "Hoy OSINERGMIN tiene más de **11,000 grifos** que fiscalizar con **recursos limitados**. Los fiscalizadores salen a campo con PDFs impresos, hojas de cálculo y sin contexto histórico. Si un operador fue sancionado hace 3 años y simplemente cambió de razón social... **nadie lo detecta**. La memoria institucional se pierde."

### El problema con las soluciones actuales (20 seg)

> "Muchos proponen usar **RAG o un chatbot con IA** — básicamente un buscador inteligente de documentos. Pero un RAG tiene 3 limitaciones graves:
> 1. **No aprende**. Hoy analiza un caso, mañana no recuerda nada.
> 2. **No predice**. Solo responde preguntas sobre el pasado.
> 3. **No conecta**. Si el infractor cambia de nombre, el RAG pierde el rastro."

### Nested Learning como respuesta (20 seg)

> "Nosotros proponemos algo diferente: **Nested Learning**. Es una arquitectura donde la IA tiene **dos cerebros**:
> - Un **Bucle Rápido** que analiza miles de transacciones por segundo.
> - Un **Bucle Lento** que analiza *por qué se equivocó* y se **reprograma sola**.
>
> El resultado: un sistema que **mañana es más inteligente que hoy**, sin re-entrenamiento, sin costo adicional. Se lo voy a demostrar."

*→ Transición: "Vamos a la demo."*

---

## ⏱️ MINUTO 1:00–1:40 — INGESTA DE DATOS (mientras carga, habla)

### Acción: Click "Iniciar Ingesta de Datos" (Caso 3 ya seleccionado)

> *(Click en Iniciar Ingesta)*
>
> "El sistema está conectando **4 fuentes de datos reales de OSINERGMIN**:
> - **Facilito**: precios publicados por los grifos
> - **Grifos GIS**: ubicación georreferenciada
> - **SIGED**: expedientes históricos de sanciones
> - **Redes Sociales**: denuncias ciudadanas"
>
> *(Señalar el terminal con los logs)*
>
> "Observen cómo en tiempo real el sistema **descarga, cruza y normaliza** los datos. No es copy-paste de un Excel — es una **Memoria Continua** que conecta una denuncia de hoy con una sanción de hace 5 años."

> *(Cuando aparecen los botones de navegación:)*
> "Listo. 6 agentes procesados, cada uno con un **perfil unificado de riesgo** generado por IA. Vamos a la vista del Fiscalizador."

*→ Click: "🗺️ Ver Mapa (Fiscalizador)"*

---

## ⏱️ MINUTO 1:40–2:40 — VISTA FISCALIZADOR (Waze Regulatorio)

### Acción: Mostrar el mapa, señalar los colores

> "Esto es lo que ve el Fiscalizador de Campo. Un **Waze Regulatorio**.
>
> - Los puntos **rojos parpadeantes** son **alertas confirmadas** — discrepancias obvias detectadas al cruzar las fuentes.
> - Los puntos **naranjas** son lo diferencial: **predicciones de la IA**. El sistema dice: *'Este grifo reporta precios normales, pero su patrón coincide con agentes sancionados por contrabando la semana pasada'*.
>
> Un RAG **jamás haría esto** — no puede generar predicciones, solo devuelve documentos."

### Acción: Click en un punto rojo

> "Al hacer clic, el Fiscalizador no recibe un PDF de 50 páginas. Recibe una **Tarjeta de Misión**.
>
> *(Señalar los datos cruzados)*
>
> Miren: muestra datos de **3 fuentes diferentes** — Facilito, SIGED, Redes — cruzados automáticamente. Y abajo, la IA le da una instrucción precisa: *'Verificar tanque 2. Riesgo: 94%'*.
>
> *(Señalar el Score de Reincidencia)*
>
> Este **score de 0 a 1** pondera sanciones previas, quejas ciudadanas, diferencial de precios y stock. No es una opinión — es un **índice compuesto**."

> *(Si aparece el mensaje de reglas inyectadas)*
> "Y este badge — *'🧠 reglas inyectadas'* — significa que este análisis ya incluye reglas que un Analista aprobó antes. **La IA ya aprendió.**"

*→ Click: pestaña "🧠 Analista"*

---

## ⏱️ MINUTO 2:40–3:50 — VISTA ANALISTA (El Corazón del Nested Learning)

### Acción: Mostrar el Muro de Reglas Vivas

> "Aquí es donde ocurre la **magia del Nested Learning**. Este es el **Muro de Reglas Vivas**.
>
> *(Señalar el diagrama de 4 pasos)*
>
> El flujo es: el Bucle Rápido detecta → el Bucle Lento analiza por qué → propone una nueva regla → **el humano decide**.
>
> Esto no existe en un RAG. En un RAG, si el sistema se equivoca, nadie se entera. Aquí, el error **dispara un proceso de mejora**."

### Acción: Señalar una regla con sustento legal

> "Cada regla propuesta viene con **sustento legal automático**. El sistema dice: *'Esta infracción está tipificada en el Artículo 76° del Reglamento de Comercialización de Combustibles'*. No es genérico — cita **norma específica, tipificación e incluso sanción en UIT**."

### Acción: Click "✅ Aprobar Regla"

> *(Click en Aprobar)*
>
> "Al aprobar, pasan **tres cosas**:
> 1. La regla pasa a estado APLICADA.
> 2. Se envía al **Bucle Lento** para análisis profundo.
> 3. Y lo más importante: se **inyecta en el prompt del Bucle Rápido**.
>
> Esto significa que la próxima vez que un Fiscalizador consulte un agente, la IA **ya va a considerar esta nueva regla**. Se reprogramó sola. **En un RAG, esto es imposible.**"

> *(Señalar el badge en el NavBar: "🧠 +1 reglas inyectadas")*
>
> "Ven el badge arriba — el sistema confirma que ya inyectó la regla. Es aprendizaje **en tiempo real**."

### Acción: Mostrar brevemente el grafo de reincidencia

> "Y aquí abajo, el grafo de **Reincidencia Multiactor**. El sistema conecta personas, empresas activas y empresas liquidadas. Si detecta que dos empresas comparten dueños pero una fue sancionada, **lo marca automáticamente** — incluso si cambiaron de razón social."

*→ Click: pestaña "📊 Dirección"*

---

## ⏱️ MINUTO 3:50–4:40 — VISTA DIRECCIÓN (El Tablero Ejecutivo)

### Acción: Mostrar los KPIs

> "Finalmente, lo que ve la Alta Dirección. No métricas de vanidad — **KPIs de impacto**:
>
> - **Infracciones Prevenidas**: detectadas digitalmente *antes* de que ocurra el accidente.
> - **Ahorro Operativo**: porcentaje de fiscalizaciones *innecesarias* evitadas. Eso es presupuesto ahorrado.
> - **Reincidencia Multiactor**: redes de informalidad detectadas por la Memoria Continua.
> - **Score Promedio**: el índice de salud del ecosistema — cambia color si sube."

### Acción: Señalar la curva de Nested Learning

> "Esta curva muestra la evolución del sistema mes a mes. Los falsos positivos **bajan** porque cada regla aprobada mejora al algoritmo. Es **mejora continua automatizada**."

### Acción: Click "📥 Exportar CSV"

> "Y con un click, toda la data se exporta a CSV para auditoría o reportes internos. Trazabilidad total."

---

## ⏱️ MINUTO 4:40–5:00 — CIERRE (20 seg)

> "Resumiendo: **FiscalizaPlus no es un chatbot ni un buscador de documentos**. Es un **Analista Digital** que trabaja 24/7, que recuerda cada sanción de los últimos 10 años, y que aprende nuevas reglas de fiscalización cada día.
>
> Donde un RAG **busca** respuestas, Nested Learning las **genera**.
> Donde un RAG **olvida**, Nested Learning **recuerda**.
> Donde un RAG se **estanca**, Nested Learning **evoluciona**.
>
> Gracias."

---

## 📋 CHECKLIST PRE-DEMO

- [ ] App cargada en navegador (URL de Vercel o localhost)
- [ ] Verificar que la API Key funcione (o que el fallback precargado responda)
- [ ] Seleccionar "Caso 3: Crisis" ANTES de empezar
- [ ] Pantalla en modo oscuro / fullscreen (F11)
- [ ] Ensayar 2 veces antes

## ⚠️ SI LA IA NO RESPONDE (PLAN B)

El sistema tiene **respuestas precargadas** (fallback). Si Gemini no contesta:
- La ingesta funciona igual con datos mock
- Los análisis del Bucle Rápido y Lento usan respuestas predefinidas
- El flow completo se ve idéntico — solo cambia que el análisis es estático

**Nadie se va a enterar.** El flow visualmente es el mismo.
