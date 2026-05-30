import { Router } from 'express';
import { create, getAll, getById, update, remove } from '../controllers/index.js';
import { validateCreate, validateUpdate } from '../validator/index.js';
import auth from '../../../middlewares/auth.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', auth, validateCreate, create);
router.put('/:id', auth, validateUpdate, update);
router.delete('/:id', auth, remove);

export default router;
