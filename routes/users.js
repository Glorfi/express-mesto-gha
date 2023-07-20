const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { userDataConfig } = require('../utils/validationConfig');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate(userDataConfig), updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:id', getUser);

module.exports = router;
