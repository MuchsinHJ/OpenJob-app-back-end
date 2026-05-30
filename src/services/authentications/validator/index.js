import { validate } from '../../../middlewares/validate.js';
import { loginSchema, refreshSchema, logoutSchema } from './schema.js';

const validateLogin = validate(loginSchema);
const validateRefresh = validate(refreshSchema);
const validateLogout = validate(logoutSchema);

export { validateLogin, validateRefresh, validateLogout };
