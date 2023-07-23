const Card = require('../models/card');
const { NotFound, NotAuthorized } = require('../utils/errorsConfig');

module.exports.getCards = (req, res) => {
  Card.find({}).then((cards) => {
    res.send(cards);
  });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFound('Карточка не найдена'));
      }
      if (card.owner.toString() !== userId.toString()) {
        return Promise.reject(new NotAuthorized('Нет прав на удаление карточки'));
      }
      return Card.findByIdAndDelete(req.params.id);
    })
    .then((deletedCard) => res.send(deletedCard))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

// подумать на будущее как вставлять в card.owner и card.likes объект с данными пользователя,
// как это реализовано в оригинальной апишке
// вероятно надо будет импортировать модель юзера сюда и искать о нем данные,
// а потом вставлять найденный объект в данные карточки
