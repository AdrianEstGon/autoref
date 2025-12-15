// Configuración de la API - usa variable de entorno o fallback a localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api';

export default API_URL;
