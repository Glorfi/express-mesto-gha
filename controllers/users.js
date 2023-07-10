const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  });
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else { res.send(user); }
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Введены некоректные данные в теле запроса' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  //   .catch((err) => res.send({ message: err }));
};

module.exports.updateUserInfo = (req, res) => {
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
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Введены некоректные данные в теле запроса' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        res
          .status(400)
          .send({ message: 'Введены некоректные данные в теле запроса' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
