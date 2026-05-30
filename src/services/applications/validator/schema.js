import Joi from 'joi';

const applySchema = Joi.object({
  job_id: Joi.string().max(50).required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().max(50).required(),
});

export { applySchema, updateStatusSchema };
