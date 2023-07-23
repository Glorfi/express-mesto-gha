const { Joi, Segments } = require('celebrate');

const avatarRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?#?$/;

const credentialsConfig = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email({ tlds: false }),
    avatar: Joi.string().regex(avatarRegex),
    password: Joi.string().required().min(3),
  }),
};

const updateUserInfoConfig = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

const idConfig = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().min(24).max(24),
  }),
};

const updateAvatarConfig = {
  body: Joi.object().keys({
    avatar: Joi.string().regex(avatarRegex),
  }),
};

module.exports = {
  credentialsConfig, updateUserInfoConfig, idConfig, updateAvatarConfig,
};
