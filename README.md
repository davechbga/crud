# Gestión de Recursos Técnicos

Aplicación CRUD desarrollada con **React + TypeScript + Appwrite** para la gestión de recursos técnicos.

## 🚀 Tecnologías Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Appwrite](https://appwrite.io/)
- [ShadCN/UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Sonner](https://sonner.emilkowal.ski/getting-started) para notificaciones

## 🧱 Estructura del Proyecto

```
📁 src
│
│
├── 📁 components           ← Componentes
│   ├── 📁 ui               ← Componentes UI reutilizables (shadcn/ui)
│   └── 📁 dashboard        ← Componentes de panel
│
├── 📁 features
│   ├── 📁 auth
│   │    ├── 📁 components    ← Componentes de autenticación
│   │    ├── 📁 hooks         ← Hooks relacionados con autenticación
│   │    └── 📁 services      ← Servicios de autenticación
│   │
│   └── 📁 resources
│        ├── 📁 components       ← Componentes de recursos
│        ├── 📁 hooks            ← Hooks relacionados con recursos
│        └── 📁 services         ← Servicios de recursos
│
├── 📁 interfaces          ← Interfaces y tipos TypeScript
│
├── 📁 lib
│   │── appwrite.ts        ← Conexión a Appwrite y configuración
│   └── lib.ts             ← Funciones utilitarias
│
├── 📁 pages
│   ├── DashboardPage.tsx   ← Página principal del panel
│   ├── LoginPage.tsx       ← Página de inicio de sesión
│   ├── NotFoundPage.tsx    ← Página de error 404
│   ├── RegisterPage.tsx    ← Página de registro
│   └── VerifyEmailPage.tsx ← Página de verificación de correo electrónico
│
├── index.css            ← Archivo de estilos globales
├── App.tsx              ← Componente principal de la aplicación
└── main.tsx             ← Punto de entrada de la aplicación
```

## ⚙️ Instrucciones para Correr el Proyecto Localmente

1. **Clonar el repositorio:**

```bash
git clone https://github.com/davechbga/crud.git
cd crud
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**
   NOTA: SE INCLUYE DENTRO DE REPOSITORIO CREDENCIALES DE APPWRITE PARA QUE PUEDAS PROBARLO DIRECTAMENTE.
   Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
VITE_APPWRITE_ENDPOINT=https://<tu-endpoint-appwrite>
VITE_APPWRITE_PROJECT=<tu-id-de-proyecto>
VITE_APPWRITE_DATABASE=<tu-id-de-database>
VITE_APPWRITE_COLLECTION=<tu-id-de-colección>
```

4. **Levantar la aplicación:**

```bash
npm run dev
```

5. **Acceder desde tu navegador:**

```
http://localhost:5173
```

## 🧪 Funcionalidades

- Registro e inicio de sesión de usuarios
- Manejo de sesión con Appwrite
- Validación de formularios
- Manejo de errores y feedback al usuario
- Código organizado por módulos y características

## 🧠 Buenas Prácticas

- Código modular y limpio
- Separación lógica y componentes por feature
- Uso de tipado fuerte con TypeScript
- Composición con Hooks y componentes reutilizables
- Feedback inmediato al usuario con notificaciones

---

Hecho con 💻 por [davechbga](https://github.com/davechbga)
