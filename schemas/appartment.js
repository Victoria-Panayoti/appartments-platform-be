const Joi = require("joi");

const appartmentSchema = Joi.object({
  picture: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  description: Joi.string().required(),
  rating: Joi.number().required(),
  price: Joi.number().required(),
});

module.exports = {
    appartmentSchema,
}