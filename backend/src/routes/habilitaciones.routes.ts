import { Router } from 'express';
import {
  getHabilitaciones,
  getHabilitacionById,
  createHabilitacion,
  aprobarHabilitacion,
  rechazarHabilitacion,
  deleteHabilitacion,
} from '../controllers/habilitaciones.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getHabilitaciones);
router.get('/:id', getHabilitacionById);
router.post('/', createHabilitacion);
router.post('/:id/aprobar', aprobarHabilitacion);
router.post('/:id/rechazar', rechazarHabilitacion);
router.delete('/:id', deleteHabilitacion);

export default router;
