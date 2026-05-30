import { addUser, getUserById } from '../repositories/index.js';
import { sendSuccess } from '../../../utils/response.js';

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = await addUser({ name, email, password, role });
    sendSuccess(res, 201, "User berhasil ditambahkan", { id: userId });
  } catch (err) {
    next(err);
  }
};

const getUserByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    sendSuccess(res, 200, null, user);
  } catch (err) {
    next(err);
  }
};

export { register, getUserByIdHandler };
