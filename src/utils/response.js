const sendSuccess = (res, statusCode, message, data) => {
  const responseBody = { status: "success" };
  if (message) responseBody.message = message;
  if (data !== null && data !== undefined) responseBody.data = data;
  return res.status(statusCode).json(responseBody);
};

const sendError = (res, statusCode, message) => {
  const responseBody = { status: "failed" };
  if (message) responseBody.message = message;
  return res.status(statusCode).json(responseBody);
};

export { sendSuccess, sendError };
