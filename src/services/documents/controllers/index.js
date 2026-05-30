import {
  addDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} from "../repositories/index.js";
import { sendSuccess } from "../../../utils/response.js";

const upload = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { filename, path: filepath } = req.file;
    const documentId = await addDocument({ user_id, filename, filepath });
    sendSuccess(res, 201, { documentId });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const documents = await getAllDocuments();
    sendSuccess(res, 200, { documents });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const document = await getDocumentById(req.params.id);
    sendSuccess(res, 200, { document });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteDocument(req.params.id);
    sendSuccess(res, 200, { message: "Document berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};

export { upload, getAll, getById, remove };
