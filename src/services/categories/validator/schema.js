import Joi from 'joi';

const createSchema = Joi.object({
  name: Joi.string().max(255).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().max(255).required(),
});

export { createSchema, updateSchema };
