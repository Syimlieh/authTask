const UserService = require("../services/user.service");
const { USER_ROLES, USER_VISIBILITY } = require("../utils/constants.utils");

const { formatResponse } = require("../utils/general.utils");

const getUser = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = "Get user Profile(For both self and other Profile."
  /*
    #swagger.security = [{
        "jwtToken": []
    }],
    #swagger.parameters['userId'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'User Object Id: For Other Public Profile id'
    }
  */

  const user = req.user;
  const { userId } = req.query;
  let query = { _id: userId || user._id };
  if (userId && userId !== user._id && user.userRole !== USER_ROLES.ADMIN) {
    query.visibility = USER_VISIBILITY.PUBLIC;
  }
  
  const result = await UserService.getUser(query);
  return formatResponse(res, result, result.status);
};

const getUsers = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = "List of All Public Profile"
  /*
    #swagger.security = [{
        "jwtToken": []
    }],
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Number of items per page'
    }
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Page number'
    }
    #swagger.parameters['order_by'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Default: updatedAt'
    }
    #swagger.parameters['order_direction'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: 'Possible value: [ASC, DESC]'
    }
  */

  const user = req.user;
  const filters = req.query;

  if (user.userRole === USER_ROLES.END_USER) {
    filters.visibility = USER_VISIBILITY.PUBLIC;
  }

  const result = await UserService.getUsers(filters);
  return formatResponse(res, result, result.status);
};

const updateUser = async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = "Update Profile"
  /*
    #swagger.security = [{
        "jwtToken": []
    }],
    #swagger.parameters['obj'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: 'User details',
      schema: {
        $name: "John Doe",
        $mobile: "9898767898",
        $bio: "Bio details",
        $profile: "https://images.app.goo.gl/7AqpKwn4Xf2gTPL36",
        $visibility: "Public, Private"
      }
    }
  */
  const { _id } = req.user;
  console.log("req.user", _id);
  const payload = req.body;
  const result = await UserService.updateUser(_id, payload);
  return formatResponse(res, result, result.status);
};

module.exports = {
  getUser,
  getUsers,
  updateUser,
};
