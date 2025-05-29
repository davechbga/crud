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
src/
├── components/
├── contexts/
│   └── AuthContext.tsx
├── features/
│   ├── auth/
│   │   ├── AuthForm.tsx
│   │   ├── authService.ts
│   │   └── useAuth.ts
│   └── resources/
│       ├── ResourceCard.tsx
│       ├── ResourceForm.tsx
│       └── useResources.tsx
├── lib/
│   └── appwrite.ts
├── pages/
│   └── Index.tsx
│   └── NotFound.tsx
│   App.tsx
└── main.tsx
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

## 📁 Recomendaciones

- Usa cuentas válidas para probar la autenticación.
- Verifica que tu Appwrite esté corriendo y accesible desde el frontend.
- Si usas Appwrite local, configura correctamente tu archivo `hosts`.

## 🧠 Buenas Prácticas

- Código modular y limpio
- Separación lógica por feature
- Uso de tipado fuerte con TypeScript
- Composición con Hooks
- Feedback inmediato al usuario con notificaciones

---

Hecho con 💻 por [davechbga](https://github.com/davechbga)