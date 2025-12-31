import { Router } from 'express';
import {
  getPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona
} from '../controllers/personas.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getPersonas);
router.get('/:id', getPersonaById);
router.post('/', authorize('FEDERACION', 'CLUB'), createPersona);
router.put('/:id', authorize('FEDERACION', 'CLUB'), updatePersona);
router.delete('/:id', authorize('FEDERACION'), deletePersona);

export default router;
