const { Joi } = require('celebrate');

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

module.exports = { credentialsConfig, updateUserInfoConfig };
