# 🛡️ OSINERGMIN NL — Centro de Comando (v2 Dynamic)

> **Sistema de Fiscalización Inteligente con Nested Learning (Google HOPE)**
> *Ingesta Real • IA Continua • 3 Escenarios de Riesgo*

---

## 🚀 Estado del Proyecto: v2 (Completado)

Este proyecto ha evolucionado de un prototipo estático a un **simulador dinámico** que ingestan datos reales y reacciona ante diferentes escenarios de riesgo.

### 🌟 Nuevas Funcionalidades (v2)

- **3 Escenarios de Datos**: Selector para simular *Normalidad*, *Bajo Riesgo* y *Crisis*.
- **IA Dinámica**: Gemini Flash 2.5 analiza los CSV/JSON reales en tiempo real.
- **KPIs Vivos**: Métricas calculadas al milímetro basadas en la ingesta.
- **Grafo de Reincidencia**: Generación automática de redes de contactos por RUC.
- **Seguridad**: Gestión de API Keys mediante variables de entorno.

---

## 📚 Documentación Clave

| Guía | Propósito |
|---|---|
| 📖 **[Walkthrough v2](walkthrough.md)** | Tour detallado por las nuevas funcionalidades y pantallas. |
| ☁️ **[Guía de Despliegue](DEPLOY.md)** | Pasos para subir el proyecto a Vercel/GitHub (CI/CD). |
| 🧠 **[Skill: Nested Learning](.agent/skills/nested-learning/SKILL.md)** | Teoría del framework de aprendizaje continuo implementado. |

---

## 🛠️ Cómo Ejecutar Localmente

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Configurar API Key** (Opcional para IA real):
    - Crea un archivo `.env` basado en `.env.example`.
    - Agrega tu `VITE_GEMINI_API_KEY`.

3.  **Iniciar servidor**:
    ```bash
    npm run dev
    ```

---

## 🏗️ Arquitectura

El sistema sigue una arquitectura de 3 capas alineada con el patrón Nested Learning:

1.  **Capa Ingesta**: Descarga y normalización de 4 fuentes (Facilito, SIGED, Redes, GIS).
2.  **Capa IA**:
    - **Bucle Rápido**: Gemini analiza agentes individuales en tiempo real.
    - **Bucle Lento**: Gemini analiza patrones históricos y propone nuevas reglas.
3.  **Capa Visualización**: 3 Vistas especializadas (Fiscalizador, Analista, Dirección).

---

*Proyecto actualizado el 11 de febrero de 2026.*
