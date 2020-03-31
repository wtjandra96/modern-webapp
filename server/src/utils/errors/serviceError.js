class ServiceError extends Error {
  constructor (httpStatusCode, errors) {
    super();
    this.name = "ServiceError";
    this.httpStatusCode = httpStatusCode;
    this.errors = errors;
    this.date = new Date();
  }
}

module.exports = ServiceError;
