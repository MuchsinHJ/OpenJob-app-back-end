import { AuthenticationError } from '../exceptions/index.js';
import TokenManager from '../security/token-manager.js';

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid Authorization header');
    }

    const token = authHeader.slice(7);
    const payload = TokenManager.verifyAccessToken(token);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
