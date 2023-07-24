const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DuplicatedEmail = require('../utils/DuplicatedEmail');
const NotFound = require('../utils/NotFound');
const WrongFormat = require('../utils/WrongFormat');
const AuthorizationRequired = require('../utils/AuthorizationRequired');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFound('Пользователь не найден'));
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    // .then((user) => User.findById(user._id).select('-password').lean())
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new WrongFormat('Неверный формат передаваемых данных');
        next(e);
      }
      if (err.code === 11000) {
        const duplicateEmailError = new DuplicatedEmail(
          'Пользователь с данным email уже существует',
        );
        next(duplicateEmailError);
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new WrongFormat('Неверный формат передаваемых данных');
        next(e);
      } else next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new WrongFormat('Неверный формат передаваемых данных');
        next(e);
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw (new AuthorizationRequired('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw (new AuthorizationRequired('Неправильные почта или пароль'));
        }
        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
