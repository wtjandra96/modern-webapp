class MongoError extends Error {
  constructor (httpStatusCode, errors) {
    super();
    this.name = "MongoError";
    this.httpStatusCode = httpStatusCode;
    this.errors = errors;
    this.date = new Date();
  }
}

module.exports = MongoError;
