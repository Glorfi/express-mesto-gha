const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { DuplicatedEmail, UserNotFound } = require('../utils/errorsConfig');

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  });
};
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new UserNotFound('Пользователь не найден'));
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
        return Promise.reject(new UserNotFound('Пользователь не найден'));
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
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        const duplicateEmailError = new DuplicatedEmail(
          'Пользователь с данным email уже существует',
        );
        next(duplicateEmailError);
      } else {
        next();
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
    .catch(next);
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
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
