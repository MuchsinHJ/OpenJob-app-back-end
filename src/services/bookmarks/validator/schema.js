import Joi from 'joi';

// Bookmark schema is optional per PRD, but define basic schemas
const bookmarkSchema = Joi.object({
  job_id: Joi.string().max(50),
});

export { bookmarkSchema };
