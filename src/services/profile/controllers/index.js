import {
  getUserProfile,
  getApplicationsByUserId,
  getBookmarksByUserId,
} from "../repositories/index.js";
import { sendSuccess } from "../../../utils/response.js";

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    sendSuccess(res, 200, null, user );
  } catch (err) {
    next(err);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await getApplicationsByUserId(req.user.id);
    sendSuccess(res, 200, null, { applications });
  } catch (err) {
    next(err);
  }
};

const getMyBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await getBookmarksByUserId(req.user.id);
    sendSuccess(res, 200, null, { bookmarks });
  } catch (err) {
    next(err);
  }
};

export { getProfile, getMyApplications, getMyBookmarks };
