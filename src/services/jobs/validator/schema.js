import Joi from 'joi';

const createSchema = Joi.object({
  company_id: Joi.string().max(50).required(),
  category_id: Joi.string().max(50).required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow('', null),
  job_type: Joi.string().max(50).allow('', null),
  experience_level: Joi.string().max(50).allow('', null),
  location_type: Joi.string().max(50).allow('', null),
  location_city: Joi.string().max(100).allow('', null),
  salary_min: Joi.number().integer().allow(null),
  salary_max: Joi.number().integer().allow(null),
  is_salary_visible: Joi.boolean().default(true),
  status: Joi.string().max(50).default('open'),
});

const updateSchema = Joi.object({
  company_id: Joi.string().max(50),
  category_id: Joi.string().max(50),
  title: Joi.string().max(255),
  description: Joi.string().allow('', null),
  job_type: Joi.string().max(50).allow('', null),
  experience_level: Joi.string().max(50).allow('', null),
  location_type: Joi.string().max(50).allow('', null),
  location_city: Joi.string().max(100).allow('', null),
  salary_min: Joi.number().integer().allow(null),
  salary_max: Joi.number().integer().allow(null),
  is_salary_visible: Joi.boolean(),
  status: Joi.string().max(50),
}).min(1);

export { createSchema, updateSchema };
