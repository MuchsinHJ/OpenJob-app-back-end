import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../exceptions/index.js';

const TokenManager = {
  generateAccessToken: (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' }),

  generateRefreshToken: (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    } catch (error) {
      throw new AuthenticationError('Access token tidak valid');
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new AuthenticationError('Refresh token tidak valid');
    }
  },
};

export default TokenManager;
