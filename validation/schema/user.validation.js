const Joi = require('joi');
const { RegExr, USER_VISIBILITY } = require('../../utils/constants.utils');
Joi.objectId = require('joi-objectid')(Joi)

const userUpdateValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  mobile: Joi.string().pattern(new RegExp(RegExr.MOBILE)).required().messages({
    'string.pattern.base': 'Mobile Number is not valid',
  }),
  bio: Joi.string().min(5).required(),
  profile: Joi.string().uri().required(),
  visibility: Joi.string().valid(...Object.values(USER_VISIBILITY))
});

const filterValidation = Joi.object({
  limit: Joi.number(),
  page: Joi.number(),
  order_by: Joi.string(),
  order_direction: Joi.string(),
});

const userIdValidation = Joi.object({
  userId: Joi.objectId(),
});

module.exports = {
  userUpdateValidation,
  filterValidation,
  userIdValidation,
}