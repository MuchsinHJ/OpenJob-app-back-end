import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { upload as uploadHandler, getAll, getById, remove } from '../controllers/index.js';
import auth from '../../../middlewares/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({ storage });

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', auth, uploadMiddleware.single('document'), uploadHandler);
router.delete('/:id', auth, remove);

export default router;
