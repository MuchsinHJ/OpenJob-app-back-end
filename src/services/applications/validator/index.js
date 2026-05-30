import { validate } from '../../../middlewares/validate.js';
import { applySchema, updateStatusSchema } from './schema.js';

const validateApply = validate(applySchema);
const validateUpdateStatus = validate(updateStatusSchema);

export { validateApply, validateUpdateStatus };
