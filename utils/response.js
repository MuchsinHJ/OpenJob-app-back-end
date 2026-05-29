'use strict';

const sendSuccess = (res, statusCode, data) =>
  res.status(statusCode).json({ status: 'success', data });

const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ status: 'fail', message });

module.exports = { sendSuccess, sendError };
