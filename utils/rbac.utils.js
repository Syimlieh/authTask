/* eslint-disable func-names */
const { formatResponse } = require('./general.utils');

module.exports = function (roles) {
  // eslint-disable-next-line consistent-return
  return async function (req, res, next) {
    try {
      if (!roles.includes(req.user.userRole)) {
        throw new Error('Unauthorized');
      }
    } catch (err) {
      return formatResponse(res, { error: 'Unauthorized' }, 401);
    }
    next();
  };
};
