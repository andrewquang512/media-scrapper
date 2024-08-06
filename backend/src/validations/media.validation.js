const Joi = require('joi');

const insertMedia = {
  body: Joi.object().keys({
    URLs: Joi.array().items(Joi.string()),
  }),
};

module.exports = {
  insertMedia,
};
