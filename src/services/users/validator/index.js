import { validate } from '../../../middlewares/validate.js';
import { registerSchema } from './schema.js';

const validateRegister = validate(registerSchema);

export { validateRegister };
