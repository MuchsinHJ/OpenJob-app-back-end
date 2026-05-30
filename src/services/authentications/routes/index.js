import { Router } from 'express';
import { login, refreshTokenHandler, logout } from '../controllers/index.js';
import { validateLogin, validateRefresh, validateLogout } from '../validator/index.js';
import auth from '../../../middlewares/auth.js';

const router = Router();

router.post('/', validateLogin, login);
router.put('/', validateRefresh, refreshTokenHandler);
router.delete('/', auth, validateLogout, logout);

export default router;
