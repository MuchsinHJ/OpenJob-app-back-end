const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, //memvalidasi keseluruhan error (false)
    allowUnknown: true, //memungkinkan field yang tidak ada di schema dijalankan (true)
    stripUnknown: true, //menghapus field yang tidak ada di schema (true)
  });

  if (error) {
    error.isJoi = true;
    return next(error);
  }

  req.validated = value;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });
  if (error) return next(error);
  req.validated = value;
  next();
};

export { validate, validateQuery };
