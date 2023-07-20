class DuplicatedEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class WrongFormat extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
module.exports = { DuplicatedEmail, UserNotFound, WrongFormat };
