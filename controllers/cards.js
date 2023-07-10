const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({}).then((cards) => {
    res.send(cards);
  });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.id)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// подумать на будущее как вставлять в card.owner и card.likes объект с данными пользователя,
// как это реализовано в оригинальной апишкеб
// вероятно надо будет импортировать модель юзера сюда и искать о нем данные,
// а потом вставлять найденный объект в данные карточки
