import { validate } from '../../../middlewares/validate.js';
import { createSchema, updateSchema } from './schema.js';

const validateCreate = validate(createSchema);
const validateUpdate = validate(updateSchema);

export { validateCreate, validateUpdate };
