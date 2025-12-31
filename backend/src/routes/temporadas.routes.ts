import { Router } from 'express';
import {
  getTemporadas,
  getTemporadaById,
  createTemporada,
  updateTemporada,
  deleteTemporada,
} from '../controllers/temporadas.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getTemporadas);
router.get('/:id', getTemporadaById);
router.post('/', createTemporada);
router.put('/:id', updateTemporada);
router.delete('/:id', deleteTemporada);

export default router;
