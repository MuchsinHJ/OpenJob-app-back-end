import { Router } from 'express';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';
import companies from '../services/companies/routes/index.js';
import categories from '../services/categories/routes/index.js';
import jobs from '../services/jobs/routes/index.js';
import applications from '../services/applications/routes/index.js';
import bookmarks from '../services/bookmarks/routes/index.js';
import profile from '../services/profile/routes/index.js';
import documents from '../services/documents/routes/index.js';

const router = Router();
router.use("/users", users);
router.use("/authentications", authentications);
router.use("/companies", companies);
router.use("/categories", categories);
router.use("/jobs", jobs);
router.use("/applications", applications);
router.use("/bookmarks", bookmarks);
router.use("/profile", profile);
router.use("/documents", documents);

export default router;