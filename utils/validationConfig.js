const { Joi } = require('celebrate');

const credentialsConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: false }),
    password: Joi.string().required().min(4).max(8),
  }),
};

const userDataConfig = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  })
}

module.exports = { credentialsConfig, userDataConfig };
