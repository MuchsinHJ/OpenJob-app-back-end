import {
  addBookmark,
  getBookmarksByUserId,
  getBookmarkById,
  deleteBookmarkByUserAndJob,
} from "../repositories/index.js";
import { sendSuccess } from "../../../utils/response.js";

const add = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const job_id = req.params.jobId;
    const bookmarkId = await addBookmark({ user_id, job_id });
    sendSuccess(res, 201, "Bookmark berhasil ditambahkan", { id: bookmarkId });
  } catch (err) {
    next(err);
  }
};

const getAllByUser = async (req, res, next) => {
  try {
    const bookmarks = await getBookmarksByUserId(req.user.id);
    sendSuccess(res, 200, null, { bookmarks });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const bookmark = await getBookmarkById(req.params.id);
    sendSuccess(res, 200, null,  bookmark );
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const job_id = req.params.jobId;
    await deleteBookmarkByUserAndJob(user_id, job_id);
    sendSuccess(res, 200, "Bookmark berhasil dihapus", null);
  } catch (err) {
    next(err);
  }
};

export { add, getAllByUser, getById, remove };
