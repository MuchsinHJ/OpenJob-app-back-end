import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../repositories/index.js";
import { sendSuccess } from "../../../utils/response.js";

const create = async (req, res, next) => {
  try {
    const categoryId = await addCategory(req.body);
    sendSuccess(res, 201, "Category berhasil ditambahkan", { id: categoryId });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    sendSuccess(res, 200, null, { categories });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    sendSuccess(res, 200, null, category);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await updateCategory(req.params.id, req.body);
    sendSuccess(res, 200, "Category berhasil diperbarui", null);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    sendSuccess(res, 200, "Category berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getById, update, remove };
