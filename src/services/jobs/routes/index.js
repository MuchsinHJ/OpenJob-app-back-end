import { Router } from 'express';
import { create, getAll, getById, getByCompany, getByCategory, update, remove } from '../controllers/index.js';
import { validateCreate, validateUpdate } from '../validator/index.js';
import auth from '../../../middlewares/auth.js';
import { add as addBookmark, getById as getBookmarkById, remove as removeBookmark } from '../../bookmarks/controllers/index.js';

const router = Router();

// ⚠️ Route statis HARUS di atas route dinamis (:id)
router.get('/company/:companyId', getByCompany);
router.get('/category/:categoryId', getByCategory);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', auth, validateCreate, create);
router.put('/:id', auth, validateUpdate, update);
router.delete('/:id', auth, remove);

// Bookmark sub-routes
router.post('/:jobId/bookmark', auth, addBookmark);
router.get('/:jobId/bookmark/:id', auth, getBookmarkById);
router.delete('/:jobId/bookmark', auth, removeBookmark);

export default router;
