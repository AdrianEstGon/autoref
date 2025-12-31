import { Router } from 'express';
import {
  getModalidades,
  getModalidadById,
  createModalidad,
  updateModalidad,
  deleteModalidad,
} from '../controllers/modalidades.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getModalidades);
router.get('/:id', getModalidadById);
router.post('/', createModalidad);
router.put('/:id', updateModalidad);
router.delete('/:id', deleteModalidad);

export default router;
