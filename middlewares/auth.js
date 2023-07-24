const jwt = require('jsonwebtoken');
const AuthorizationRequired = require('../utils/AuthorizationRequired');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new AuthorizationRequired('Необходима авторизация');
    next(error);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (error) {
    const e = new AuthorizationRequired('Необходима авторизация');
    next(e);
  }
  req.user = payload;
  next();
};
