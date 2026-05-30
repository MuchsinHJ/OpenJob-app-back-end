import { validate } from '../../../middlewares/validate.js';
import { bookmarkSchema } from './schema.js';

const validateBookmark = validate(bookmarkSchema);

export { validateBookmark };
