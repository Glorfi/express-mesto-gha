const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { updateUserInfoConfig, idConfig } = require('../utils/validationConfig');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate(updateUserInfoConfig), updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:id', celebrate(idConfig), getUser);

module.exports = router;
