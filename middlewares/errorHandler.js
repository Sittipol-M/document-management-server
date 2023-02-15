const errorHandler = (error, req, res, next) => {
  const { message, status } = error;
  let response = { success: false, message };
  switch (error.constructor.name) {
    case "ValidationError":
      const { message, errors } = error;
      response = { ...response, message, errors };
      break;
  }
  return res.status(status || 500).send(response);
};

module.exports = errorHandler;
