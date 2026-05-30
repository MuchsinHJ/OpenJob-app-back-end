import { Router } from 'express';
import { register, getUserByIdHandler } from '../controllers/index.js';
import { validateRegister } from '../validator/index.js';

const router = Router();

router.post('/', validateRegister, register);
router.get('/:id', getUserByIdHandler);

export default router;
