import Joi from 'joi';

const createSchema = Joi.object({
  name: Joi.string().max(255).required(),
  location: Joi.string().max(255).required(),
  description: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().max(255),
  location: Joi.string().max(255).allow('', null),
  description: Joi.string().allow('', null),
}).min(1);

export { createSchema, updateSchema };
