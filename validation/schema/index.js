const {
  authRegisterValidation,
  authLoginValidation,
} = require('./auth.validation');

const {
  userUpdateValidation,
  filterValidation,
  userIdValidation
} = require('./user.validation');

module.exports = {
  // Auth Validation
  authRegisterValidation,
  authLoginValidation,

  // User Validation
  userUpdateValidation,
  filterValidation,
  userIdValidation,
};
