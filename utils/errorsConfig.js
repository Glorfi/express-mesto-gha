/* eslint-disable max-classes-per-file */
class DuplicatedEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class NotFound extends Error {
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

class NotAuthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
module.exports = {
  DuplicatedEmail, NotFound, WrongFormat, NotAuthorized,
};
