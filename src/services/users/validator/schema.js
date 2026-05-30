import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().max(50).required(),
});

export { registerSchema };
