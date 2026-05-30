import { sendError} from "../utils/response.js";
import { ClientError } from "../exceptions/index.js";

// eslint-disable-next-line no-unused-vars
const ErrorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return sendError(res, err.statusCode, err.message);
  }

  if (err.isJoi){
    return sendError(res, 400, err.details[0].message);
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error("Unhandled error:", err);
  return sendError(res, status, message);
}

export default ErrorHandler;

