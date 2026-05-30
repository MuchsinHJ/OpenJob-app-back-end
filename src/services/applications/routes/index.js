import { Router } from 'express';
import { apply, getAll, getById, getByUser, getByJob, updateStatus, remove } from '../controllers/index.js';
import { validateApply, validateUpdateStatus } from '../validator/index.js';
import auth from '../../../middlewares/auth.js';

const router = Router();

// ⚠️ Route statis di atas route dinamis
router.get('/user/:userId', auth, getByUser);
router.get('/job/:jobId', auth, getByJob);
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.post('/', auth, validateApply, apply);
router.put('/:id', auth, validateUpdateStatus, updateStatus);
router.delete('/:id', auth, remove);

export default router;
