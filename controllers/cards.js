const Card = require('../models/card');
const NotFound = require('../utils/NotFound');
const NotAuthorized = require('../utils/NotAuthorized');
const WrongFormat = require('../utils/WrongFormat');

module.exports.getCards = (req, res, next) => {
  Card.find({}).then((cards) => {
    res.send(cards);
  }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      if (err.name === 'ValidationError') {
        const e = new WrongFormat('Неверный формат передаваемых данных');
        next(e);
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw (new NotFound('Карточка не найдена'));
      }
      if (card.owner.toString() !== userId.toString()) {
        throw (new NotAuthorized('Нет прав на удаление карточки'));
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
        throw (new NotFound('Карточка не найдена'));
      }
      res.send(card);
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
        throw (new NotFound('Карточка не найдена'));
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
