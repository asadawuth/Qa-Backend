const createError = (message, statuscode) => {
  const error = new Error(message);
  error.statuscode = statuscode;
  return error;
};

module.exports = createError;
