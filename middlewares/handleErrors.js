const {
  DuplicatedEmail,
  NotFound,
  WrongFormat,
  NotAuthorized,
} = require('../utils/errorsConfig');

module.exports = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).json({ message: 'Неверный путь' });
  } else {
    next(err);
  }
  if (err instanceof DuplicatedEmail) {
    res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof NotFound) {
    res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof NotAuthorized) {
    res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    const e = new WrongFormat('Неверный формат идентификатора');
    res.status(e.statusCode).json({ message: e.message });
  }
  if (err.name === 'ValidationError') {
    const e = new WrongFormat('Неверный формат передаваемых данных');
    res.status(e.statusCode).json({ message: e.message });
  }
  if (err.status === 500) {
    res.status(404).json({ message: 'Внутреняя ошибка сервера' });
  }
};
