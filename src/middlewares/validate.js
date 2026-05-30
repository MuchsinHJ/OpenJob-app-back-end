const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,    // validasi semua field, tidak berhenti di error pertama
    allowUnknown: false,  // reject field yang tidak ada di schema
    stripUnknown: true,   // hapus field tidak dikenal sebelum diteruskan
    convert: false,       // NONAKTIFKAN type coercion — name:123 tetap number, tidak diubah ke "123"
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
