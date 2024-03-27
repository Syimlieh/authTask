const Joi = require('joi');
const { RegExr } = require('../../utils/constants.utils');

const authRegisterValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required().messages({
    'string.email': 'Email is not valid',
  }),
  mobile: Joi.string().pattern(new RegExp(RegExr.MOBILE)).required().messages({
    'string.pattern.base': 'Mobile Number is not valid',
  }),
  bio: Joi.string().min(5).required(),
  password: Joi.string().pattern(new RegExp(RegExr.PASSWORD)).required().messages({
    'string.pattern.base': 'Password should contain letters, numbers, and an optional special character, with a length between 3 and 30 characters.',
  }),
});

const authLoginValidation = Joi.object(
  {
    email: Joi.string().email().required().messages({
      'string.email': 'Email is not valid',
    }),
    password: Joi.string().pattern(new RegExp(RegExr.PASSWORD)).required().messages({
      'string.pattern.base': 'Password should contain letters, numbers, and an optional special character, with a length between 3 and 30 characters.',
    }),
  },
);



module.exports = {
  authRegisterValidation,
  authLoginValidation,
  
};
