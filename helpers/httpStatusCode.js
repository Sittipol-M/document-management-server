const httpStatusCodes = {
  OK: 200, //get success,put to update success
  CREATED: 201, //post and created success
  NO_CONTENT: 204, //success (find but no content)
  BAD_REQUEST: 400, //The server can’t return a response due to an error on the client’s end (validation error)
  UNAUTHORIZED: 401, //need to authorize first
  FORBIDDEN: 403, //user doesn't have permission to access
  NOT_FOUND: 404, //not found link
  CONFLICT: 409,
  INTERNAL_SERVER: 500, //unknown internal server
};

module.exports = { httpStatusCodes };
