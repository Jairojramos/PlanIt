# PlanIt

[English Version](#english) | [Versión en Español](#español)

---

<a id="english"></a>
## English Version

PlanIt is a comprehensive productivity and focus management SaaS. It integrates task management, habit tracking, and Pomodoro-style focus sessions with AI-driven analytics to optimize deep work and daily workflows.

### System Architecture

Built with a strict Clean Architecture pattern using Next.js (App Router), the project separates concerns into clear layers to ensure scalability and maintainability:

* **Controllers (API Routes):** Handle incoming requests and basic validation.
* **Services:** Encapsulate core business logic.
* **Repositories:** Handle data access and Prisma ORM operations.
* **DTOs:** Enforce data validation and typing boundaries.

### Tech Stack

* **Frontend:** Next.js (React), TypeScript, Tailwind CSS
* **Backend:** Next.js Server Components / API Routes, Node.js
* **Database:** PostgreSQL, Prisma ORM
* **Authentication:** NextAuth.js
* **AI Integration:** Google Gemini API

### Core Features

* **Task Management:** Full CRUD operations, priority sorting, status tracking, and deadlines.
* **Habit Tracking:** Daily streak monitoring and historical completion metrics.
* **Focus System:** Customizable Pomodoro timers linked to tasks, featuring an integrated ambient sound library.
* **AI Assistant:** Intelligent recommendations for session lengths, break intervals, and productivity planning.
* **Gamification:** Experience points (XP) and leveling system based on task completion and focus time.
* **Analytics Dashboard:** Real-time data visualization of productivity trends.

### Local Development Setup

**Prerequisites**
* Node.js (v20 LTS recommended)
* PostgreSQL instance

**1. Clone the repository and install dependencies:**

```bash
git clone [https://github.com/Jairojramos/PlanIt.git](https://github.com/Jairojramos/PlanIt.git)
cd planit
npm install
```

**2. Environment Configuration:**

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/planit"
NEXTAUTH_SECRET="your_generated_secret"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your_api_key"
```

**3. Database Initialization:**

```bash
npx prisma generate
npx prisma db push
```

**4. Start the development server:**

```bash
npm run dev
```

### License
Proprietary / All Rights Reserved.

---

<a id="español"></a>
## Versión en español

PlanIt es una plataforma SaaS integral de productividad y gestión de enfoque. Combina la gestión de tareas, el seguimiento de hábitos y sesiones de enfoque tipo Pomodoro con analíticas impulsadas por IA para optimizar el trabajo profundo (deep work) y los flujos diarios.

### Arquitectura del sistema

Construido bajo un estricto patrón de Arquitectura Limpia (Clean Architecture) utilizando Next.js (App Router), el proyecto separa las responsabilidades en capas claras para garantizar su escalabilidad y mantenimiento:

* **Controllers (API Routes):** Manejan las peticiones HTTP entrantes y la validación básica.
* **Services:** Encapsulan la lógica de negocio central.
* **Repositories:** Capa exclusiva para el acceso a datos y operaciones con Prisma ORM.
* **DTOs:** Definen las fronteras de validación de datos y tipado estricto.

### Stack tecnológico

* **Frontend:** Next.js (React), TypeScript, Tailwind CSS
* **Backend:** Next.js Server Components / API Routes, Node.js
* **Base de datos:** PostgreSQL, Prisma ORM
* **Autenticación:** NextAuth.js
* **Integración de IA:** Google Gemini API

### Funcionalidades principales

* **Gestión de tareas:** Operaciones CRUD completas, clasificación por prioridad, seguimiento de estados y fechas límite.
* **Seguimiento de hábitos:** Monitoreo de rachas (streaks) diarias y métricas de cumplimiento histórico.
* **Sistema de enfoque:** Temporizadores Pomodoro personalizables vinculados a tareas, con una biblioteca de sonido ambiental integrada.
* **Asistente de IA:** Recomendaciones inteligentes para duración de sesiones, intervalos de descanso y planificación de productividad.
* **Gamificación:** Sistema de puntos de experiencia (XP) y niveles basados en la finalización de tareas y tiempo de enfoque.
* **Panel de analíticas:** Visualización de datos en tiempo real sobre tendencias de productividad.

### Configuración de desarrollo local

**Requisitos previos**
* Node.js (se recomienda v20 LTS)
* Instancia de PostgreSQL

**1. Clona el repositorio e instala las dependencias:**

```bash
git clone [https://github.com/Jairojramos/PlanIt.git](https://github.com/Jairojramos/PlanIt.git)
cd planit
npm install
```

**2. Configuración de entorno:**

Crea un archivo `.env` en la raíz del directorio y añade lo siguiente:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/planit"
NEXTAUTH_SECRET="your_generated_secret"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your_api_key"
```

**3. Inicialización de la base de datos:**

```bash
npx prisma generate
npx prisma db push
```

**4. Inicia el servidor de desarrollo:**

```bash
npm run dev
```

### Licencia
Propietario / Todos los derechos reservados.
