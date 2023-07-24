const AuthorizationRequired = require('../utils/AuthorizationRequired');
const DuplicatedEmail = require('../utils/DuplicatedEmail');
const NotAuthorized = require('../utils/NotAuthorized');
const NotFound = require('../utils/NotFound');
const WrongFormat = require('../utils/WrongFormat');

module.exports = (err, req, res, next) => {
  if (
    err instanceof DuplicatedEmail
    || err instanceof NotFound
    || err instanceof NotAuthorized
    || err instanceof AuthorizationRequired
    || err instanceof WrongFormat
  ) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Внутреняя ошибка сервера' });
  }
  next(err);
};
