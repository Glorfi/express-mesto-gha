const { Joi, Segments } = require('celebrate');

const linkRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?#?$/;

const credentialsConfig = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email({ tlds: false }),
    avatar: Joi.string().regex(linkRegex),
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
    id: Joi.string().length(24).hex().required(),
  }),
};

const updateAvatarConfig = {
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkRegex),
  }),
};

const cardConfig = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegex),
  }),
};

module.exports = {
  credentialsConfig, updateUserInfoConfig, idConfig, updateAvatarConfig, cardConfig,
};
