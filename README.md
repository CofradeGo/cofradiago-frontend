# 📘 Cofradiago — Frontend

Repositorio del frontend de **Cofradiago**, la plataforma moderna para la gestión digital de hermandades y cofradías.

Este proyecto busca modernizar un sector tradicional con interfaces fluidas, accesibles y orientadas a la mejor experiencia de usuario.

---

## 🚀 Tecnologías principales

- **Vite + React**
- **TypeScript**
- **TailwindCSS**
- **React Router**
- **Zustand** (estado global)
- **Axios**
- **ESLint + Prettier**
- **Vitest**

---

## 📦 Requisitos previos

- Node.js **20+** (recomendado **22 LTS**)
- npm / pnpm / yarn
- Git

---

## 🔧 Instalación

Clona el repositorio:

```bash
git clone https://github.com/tu-org/cofradiago-frontend.git
cd cofradiago-frontend
```

Instala dependencias:

```bash
npm install
```

## 🔐 Configuración del entorno

Edita el archivo de variables de entornos,
Variables esperadas hasta el momento:

```bash
VITE_API_URL=https://api.tu-backend.com
VITE_ENV=development
```

## 🏃 Scripts disponibles

# Desarrollo

```bash
npm run dev
```

# Preview del build

```bash
npm run preview
```

# Build de producción

```bash
npm run build
```

# Linting

```bash
npm run lint
```

# Lint con autofix

```bash
npm run lint:fix
```

# Tests

```bash
npm test
```

## 📁 Estructura del proyecto

```bash
/src
  /components     → Componentes reutilizables
  /pages          → Páginas principales
  /layouts        → Layouts globales
  /hooks          → Hooks personalizados
  /stores         → Estado global (Zustand)
  /services       → APIs y llamadas HTTP
  /assets         → Imágenes y estilos
  /types          → Tipos TypeScript
  /utils          → Funciones auxiliares

```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
