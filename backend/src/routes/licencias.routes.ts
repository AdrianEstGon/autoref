import { Router } from 'express';
import {
  getLicencias,
  getLicenciaById,
  createLicencia,
  updateLicencia,
  validarLicencia,
  rechazarLicencia,
  deleteLicencia,
} from '../controllers/licencias.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getLicencias);
router.get('/:id', getLicenciaById);
router.post('/', createLicencia);
router.put('/:id', updateLicencia);
router.post('/:id/validar', validarLicencia);
router.post('/:id/rechazar', rechazarLicencia);
router.delete('/:id', deleteLicencia);

export default router;
