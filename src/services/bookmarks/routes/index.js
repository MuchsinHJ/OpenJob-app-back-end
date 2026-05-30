import { Router } from 'express';
import { getAllByUser } from '../controllers/index.js';
import auth from '../../../middlewares/auth.js';

const router = Router();

// GET /bookmarks — get all bookmarks for logged-in user
router.get('/', auth, getAllByUser);

export default router;
