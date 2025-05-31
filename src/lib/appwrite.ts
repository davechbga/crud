import { Client, Account, Databases, ID, Storage } from "appwrite";
// Configuración de Appwrite
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

// Inicializar servicios de Appwrite
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

// IDs de la base de datos y la colección
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE;
export const RESOURCES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION;
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET;

// Función para configurar el cliente de Appwrite
export const configureAppwrite = () => {
  // Configurar el cliente para manejar sesiones
  client.subscribe('account', (response) => {
    if (response.events.includes('account.*')) {
      // Manejar eventos de cuenta
      console.log('Account event:', response);
    }
  });
};

// Configurar el cliente al iniciar
configureAppwrite();
