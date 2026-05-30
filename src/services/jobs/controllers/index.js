import {
  addJob,
  getAllJobs,
  getJobById,
  getJobsByCompanyId,
  getJobsByCategoryId,
  updateJob,
  deleteJob,
} from "../repositories/index.js";
import { sendSuccess } from "../../../utils/response.js";

const create = async (req, res, next) => {
  try {
    const jobId = await addJob(req.body);
    sendSuccess(res, 201, "Job berhasil ditambahkan", { id: jobId });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const title = req.query.title || null;
    const companyName = req.query["company-name"] || null;
    const jobs = await getAllJobs({ title, companyName });
    sendSuccess(res, 200, null, { jobs });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const job = await getJobById(req.params.id);
    sendSuccess(res, 200, null, job);
  } catch (err) {
    next(err);
  }
};

const getByCompany = async (req, res, next) => {
  try {
    const jobs = await getJobsByCompanyId(req.params.companyId);
    sendSuccess(res, 200, null, { jobs });
  } catch (err) {
    next(err);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    const jobs = await getJobsByCategoryId(req.params.categoryId);
    sendSuccess(res, 200, null, { jobs });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await updateJob(req.params.id, req.body);
    sendSuccess(res, 200, "Job berhasil diperbarui", null);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteJob(req.params.id);
    sendSuccess(res, 200, "Job berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};

export { create, getAll, getById, getByCompany, getByCategory, update, remove };
