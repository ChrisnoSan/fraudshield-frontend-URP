# 🛡️ FraudShield AI — Frontend

Interfaz web para el agente inteligente de detección de fraude en seguros del mercado peruano. Construida con **Next.js 14 + TypeScript + Tailwind CSS** y desplegada en **Vercel**.

## Descripción

Frontend del sistema FraudShield AI que permite a investigadores de la Unidad de Investigación de Fraude (UIF) interactuar con el agente inteligente a través de un chat, consultar el panel de control con métricas de casos analizados, revisar sesiones activas y visualizar el razonamiento paso a paso del agente.

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Chat principal con el agente FraudShield AI |
| `/dashboard` | Dashboard de sesiones (métricas de PostgreSQL) |
| `/panel` | Panel de control para investigadores (casos analizados, scores, distritos) |
| `/traces` | Visor de razonamiento del agente (traces de LangSmith paso a paso) |

## Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + CSS custom (tema oscuro) |
| Autenticación | NextAuth con Google OAuth 2.0 |
| Markdown | React Markdown + Remark GFM (tablas) |
| Despliegue | Vercel |

## Funcionalidades

**Chat con el Agente**
- Interfaz de chat en tiempo real con el agente FraudShield AI
- Renderizado de markdown con tablas, emojis y formato estructurado
- Ejemplos precargados para análisis de siniestros y consultas
- Memoria conversacional por usuario (cada cuenta de Google tiene su propio hilo)

**Dashboard de Sesiones**
- Total de conversaciones e interacciones
- Datos almacenados y escrituras en BD
- Tabla de threads activos con actividad por investigador

**Panel de Control**
- Casos por nivel de alerta (Crítico, Revisión, Bajo)
- Score promedio y monto en riesgo (S/)
- Distribución de casos por distrito
- Tabla de últimos casos analizados con score y nivel

**Visor de Traces**
- Lista de ejecuciones del agente con duración y tokens consumidos
- Timeline interactivo paso a paso al hacer clic
- Detalle de cada herramienta usada con input/output
- Integración con LangSmith API

## Estructura del Proyecto

```
fraudshield-frontend-URP/
├── public/
│   └── .gitkeep
├── src/
│   └── app/
│       ├── api/
│       │   ├── agent/
│       │   │   └── route.ts           ← Proxy hacia Cloud Run
│       │   └── auth/
│       │       └── [...nextauth]/
│       │           └── route.ts       ← Google OAuth
│       ├── dashboard/
│       │   └── page.tsx               ← Dashboard de sesiones
│       ├── panel/
│       │   └── page.tsx               ← Panel de control
│       ├── traces/
│       │   └── page.tsx               ← Visor de traces
│       ├── globals.css                ← Tema oscuro FraudShield
│       ├── layout.tsx                 ← Layout principal + fuentes
│       └── page.tsx                   ← Chat principal
├── .gitignore
├── eslint.config.mjs
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Despliegue en Vercel

### 1. Importar repositorio
Ve a [vercel.com](https://vercel.com) → Add New Project → Importa este repo

### 2. Configurar variables de entorno

| Variable | Descripción |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Client ID de OAuth de Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client Secret de OAuth |
| `NEXTAUTH_SECRET` | Clave secreta ([generar aquí](https://auth-secret-gen.vercel.app/)) |
| `BACKEND_URL` | URL del backend en Cloud Run |

### 3. Configurar OAuth en GCP
Agregar URI de redirección en Google Cloud Console → APIs & Services → Credentials:
```
https://TU-PROYECTO.vercel.app/api/auth/callback/google
```

## Conexión con el Backend

El frontend se comunica con el backend a través de un API proxy en `src/app/api/agent/route.ts`. Las páginas de dashboard, panel y traces llaman directamente a los endpoints del backend:

| Frontend | Backend Endpoint |
|----------|-----------------|
| Chat → `/api/agent` | `/agent?msg=...&idagente=...` |
| Dashboard | `/dashboard` |
| Panel de Control | `/panel` |
| Traces | `/traces` |
| Detalle de Trace | `/trace/<id>` |

## Repositorios Relacionados

| Repo | Descripción |
|------|-------------|
| [FraudShieldAI-Backend](https://github.com/ChrisnoSan/FraudShieldAI-Backend) | Backend Flask + Agente ReAct + 7 Tools + RAG |

## Autor

**Christian Noel Sánchez Huamán**
Universidad Ricardo Palma — Programa de Especialización en Inteligencia Artificial y Generativa (4.ª edición)

---

*FraudShield AI — Proyecto Final Agente IA con LangChain | Perú 2026*
