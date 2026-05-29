const { AuthenticationError } = require('../exceptions');
const tokenManager = require('../security/token-manager');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid Authorization header');
    }

    const token = authHeader.slice(7); // hapus "Bearer "
    const payload = tokenManager.verifyAccessToken(token);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
