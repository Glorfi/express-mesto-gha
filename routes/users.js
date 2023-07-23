const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { updateUserInfoConfig } = require('../utils/validationConfig');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate(updateUserInfoConfig), updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:id', getUser);

module.exports = router;
