# 🎨 HUB Innova - Material Library Client

Interfaz moderna y reactiva desarrollada para la exploración, registro y administración del catálogo de biomateriales del HUB Innova UTEM. Este projecto implementa una arquitectura basada en Next.js, gestión de estados complejos con React Hook Form, validaciones estrictas con Zod y un diseño orientado a la eficiencia científica.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Auth-Supabase-3ECF8E?style=flat&logo=supabase)
![React Hook Form](https://img.shields.io/badge/Forms-React_Hook_Form-ec5990?style=flat&logo=react-hook-form)
![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1?style=flat&logo=zod)
![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?style=flat&logo=playwright)

## 🚀 Tecnologías

- **Framework:** Next.js 15+ (App Router)
- **Lenguaje:** TypeScript (Tipado estricto)
- **Estilos:** Tailwind CSS + Shadcn/UI
- **Gestión de Formularios:** React Hook Form
- **Validación de Esquemas:** Zod
- **Comunicación API:** Server Actions (BFF Pattern)
- **Autenticación:** Supabase Auth (Google OAuth)

## 🏗 Arquitectura

El frontend sigue una estructura modular basada en el App Router de Next.js, separando la lógica de servidor de los componentes de interacción:

```
├── src
│   ├── actions     # Server Actions (Peticiones al Backend Go / Revalidación)
│   ├── app         # Rutas, Layouts y Grupos de Rutas ((auth), (main), (admin))
│   ├── components  # Componentes UI
│   ├── constants   # Configuraciones, Enums y Enlaces de Navegación
│   ├── hooks       # Hooks personalizados para lógica de cliente
│   ├── lib         # Configuración de clientes (Supabase, Utils)
│   ├── schemas     # Definición de esquemas Zod (Contratos de validación)
│   └── types       # Definiciones de TypeScript e interfaces de la API
│
├── middleware.ts   # Protección de rutas y gestión de sesiones
└── tailwind.config # Configuración de diseño y temas
```

✨ Funcionalidades Principales

🧙‍♂️ Wizard de Registro Inteligente
Sistema de registro dividido en 4 etapas para minimizar la carga cognitiva:

    💾 Persistencia de Estado: Uso de FormProvider para mantener la integridad de los datos entre pasos.

    🛡️ Validacion Parcial: Validación estricta por etapa antes de permitir el avance.

    🎬 Gestion Multimedia: Carga dinámica de imágenes y videos asociados a instrucciones de fabricación.

📊 Panel de Administración y Moderación
Dashboard dedicado para el control de calidad del catálogo:

    ⚖️ Gestión de Solicitudes: Interfaz para aprobar o rechazar materiales con retroalimentación obligatoria.

    🔑 Control de Usuarios: Administración de roles (RBAC) y visualización de métricas de uso.

    🔔 Feed de Notificaciones: Sistema de alertas en tiempo real sobre el estado de las contribuciones.

🔍 Exploración Avanzada

    🧪 Filtros Dinámicos: Búsqueda por herramientas, composición.

    📐 Vistas de Detalle: Visualización técnica de propiedades mecánicas, perceptivas y emocionales.

    ⚡ ISR (Incremental Static Regeneration): Actualización inmediata del catálogo público mediante revalidación de caché al aprobar nuevos materiales.

🛠️ Instalación y Configuración

    1. Clonar el repositorio: git clone

          https://github.com/sllach/TT-SEM-2-front
          cd TT-SEM-2-FRONT

    2. Configurar Variables de Entorno: Crea un archivo .env en la raíz con las siguientes credenciales:

        NEXT_PUBLIC_SUPABASE_URL=
        NEXT_PUBLIC_SUPABASE_ANON_KEY=
        NEXT_PUBLIC_API_URL=
        NEXT_PUBLIC_APP_URL=

    3. Instalar dependencias:

        npm run install

    4. Ejecutar en desarollo:

        npm run dev

🚀 Desarrollado para el HUB Innova UTEM

