import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import personasRoutes from './routes/personas.routes';
import temporadasRoutes from './routes/temporadas.routes';
import modalidadesRoutes from './routes/modalidades.routes';
import categoriasRoutes from './routes/categorias.routes';
import licenciasRoutes from './routes/licencias.routes';
import habilitacionesRoutes from './routes/habilitaciones.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/personas', personasRoutes);
app.use('/api/temporadas', temporadasRoutes);
app.use('/api/modalidades', modalidadesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/licencias', licenciasRoutes);
app.use('/api/habilitaciones', habilitacionesRoutes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;
