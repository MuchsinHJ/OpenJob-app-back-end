import {
  addApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplicationStatus,
  deleteApplication,
} from "../repositories/index.js";
import { sendSuccess } from "../../../utils/response.js";

const apply = async (req, res, next) => {
  try {
    const { job_id } = req.body;
    const user_id = req.user.id;
    const applicationId = await addApplication({ user_id, job_id });
    sendSuccess(res, 201, "Application berhasil ditambahkan", { id: applicationId });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const applications = await getAllApplications();
    sendSuccess(res, 200, null, { applications });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const application = await getApplicationById(req.params.id);
    sendSuccess(res, 200, null,  application );
  } catch (err) {
    next(err);
  }
};

const getByUser = async (req, res, next) => {
  try {
    const applications = await getApplicationsByUserId(req.params.userId);
    sendSuccess(res, 200, null, { applications });
  } catch (err) {
    next(err);
  }
};

const getByJob = async (req, res, next) => {
  try {
    const applications = await getApplicationsByJobId(req.params.jobId);
    sendSuccess(res, 200, null, { applications });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await updateApplicationStatus(req.params.id, status);
    sendSuccess(res, 200, "Status application berhasil diperbarui", null);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteApplication(req.params.id);
    sendSuccess(res, 200, "Application berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};

export { apply, getAll, getById, getByUser, getByJob, updateStatus, remove };
