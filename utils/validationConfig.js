const { Joi } = require('celebrate');

const avatarRegex = /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const credentialsConfig = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email({ tlds: false }),
    avatar: Joi.string().regex(avatarRegex),
    password: Joi.string().required().min(3),
  }),
};

const userDataConfig = {
  body: Joi.object().keys({

  }),
};

module.exports = { credentialsConfig, userDataConfig };