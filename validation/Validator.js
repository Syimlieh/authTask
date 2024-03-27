/* eslint-disable func-names */
const { formatResponse } = require('../utils/general.utils');
const Validators = require('./schema');

module.exports = function (validator, query = false, params = false) {
  // eslint-disable-next-line no-prototype-builtins
  if (!Validators.hasOwnProperty(validator)) { throw new Error(`'${validator}' validator is not exist`); }

  // eslint-disable-next-line consistent-return
  return async function (req, res, next) {
    try {
      if (query) {
        if (Object.keys(req.query).length) {
          await Validators[validator].validateAsync(req.query);
        }
      } else if (params) {
        await Validators[validator].validateAsync(req.params);
      } else {
        const validated = await Validators[validator].validateAsync(req.body);
        req.body = validated;
      }
      next();
    } catch (err) {
      if (err.isJoi) { return formatResponse(res, { error: err.message }, 400); }
      return formatResponse(res, { error: 'Failed while Validating request. Please check details.' }, 400);
    }
  };
};
