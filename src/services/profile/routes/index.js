import { Router } from 'express';
import { getProfile, getMyApplications, getMyBookmarks } from '../controllers/index.js';
import auth from '../../../middlewares/auth.js';

const router = Router();

router.get('/', auth, getProfile);
router.get('/applications', auth, getMyApplications);
router.get('/bookmarks', auth, getMyBookmarks);

export default router;
