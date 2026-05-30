import {
  addCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../repositories/index.js";
import { sendSuccess } from "../../../utils/response.js";

const create = async (req, res, next) => {
  try {
    const companyId = await addCompany(req.body);
    sendSuccess(res, 201, "Company berhasil ditambahkan", { id: companyId });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const companies = await getAllCompanies();
    sendSuccess(res, 200, null, { companies });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const company = await getCompanyById(req.params.id);
    sendSuccess(res, 200, null, company);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await updateCompany(req.params.id, req.body);
    sendSuccess(res, 200, "Company berhasil diperbarui", null);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteCompany(req.params.id);
    sendSuccess(res, 200, "Company berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getById, update, remove };
