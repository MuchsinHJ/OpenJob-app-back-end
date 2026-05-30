import bcrypt from "bcrypt";
import { getUserByEmail } from "../../users/repositories/index.js";
import { addToken, findToken, deleteToken } from "../repositories/index.js";
import TokenManager from "../../../security/token-manager.js";
import { AuthenticationError, NotFoundError, InvariantError } from "../../../exceptions/index.js";
import { sendSuccess } from "../../../utils/response.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user;
    try {
      user = await getUserByEmail(email);
    } catch (err) {
      // Jika email tidak ditemukan, lempar AuthenticationError (401) bukan NotFoundError (404)
      // Ini juga meningkatkan keamanan dengan tidak mengungkapkan apakah email terdaftar
      if (err instanceof NotFoundError) {
        throw new AuthenticationError("Kredensial yang Anda berikan salah");
      }
      throw err;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    const accessToken = TokenManager.generateAccessToken({ id: user.id });
    const refreshToken = TokenManager.generateRefreshToken({ id: user.id });

    await addToken(refreshToken);

    sendSuccess(res, 200, null, { accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // verifyRefreshToken melempar AuthenticationError (401), konversi ke InvariantError (400)
    // karena refreshToken adalah input body, bukan token autentikasi request
    let payload;
    try {
      payload = TokenManager.verifyRefreshToken(refreshToken);
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }

    // findToken melempar NotFoundError (404), konversi ke InvariantError (400)
    try {
      await findToken(refreshToken);
    } catch {
      throw new InvariantError('Refresh token tidak ditemukan');
    }

    const accessToken = TokenManager.generateAccessToken({ id: payload.id });

    sendSuccess(res, 200, null, { accessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // verifyRefreshToken melempar AuthenticationError (401), konversi ke InvariantError (400)
    try {
      TokenManager.verifyRefreshToken(refreshToken);
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }

    // deleteToken melempar InvariantError (400) jika tidak ada — sudah benar
    await deleteToken(refreshToken);

    sendSuccess(res, 200, "Logout berhasil", null);
  } catch (err) {
    next(err);
  }
};

export { login, refreshTokenHandler, logout };
