const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardConfig, idConfig } = require('../utils/validationConfig');

router.get('/', getCards);
router.post('/', celebrate(cardConfig), createCard);
router.delete('/:id', celebrate(idConfig), deleteCard);
router.put('/:id/likes', celebrate(idConfig), likeCard);
router.delete('/:id/likes', celebrate(idConfig), dislikeCard);

module.exports = router;
