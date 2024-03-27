const Users = require("../schemas/user");
const UserPipeline = require("../pipelines/user.pipeline")

const getUser = async (query) => {
  try {
    const result = await Users.findOne(query);
    if (!result) {
      return {
        success: false,
        status: 404,
        data: {
          message: "User Not Found.",
        },
      };
    }
    return {
      success: true,
      status: 200,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      data: { error: "Something went wrong." },
    };
  }
};

const getUsers = async (filters) => {
  try {
    const pipeline = UserPipeline.getUsersPipeline(filters);
    const results = await Users.aggregate(pipeline);
    return {
      success: true,
      status: 200,
      data: results,
    };
  } catch (error) {
    console.log('err--------------->', error.message)
    return {
      success: false,
      status: 500,
      data: { error: "Something went wrong." },
    };
  }
};

const updateUser = async (userId, payload) => {
  try {
    const result = await Users.findOneAndUpdate(
      { _id: userId },
      { $set: payload },
      { new: true }
    );
    if (!result) {
      return {
        success: false,
        status: 404,
        data: {
          message: "User Not Found.",
        },
      };
    }
    return {
      success: true,
      status: 200,
      data: result,
    };
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return {
        success: false,
        code: 400,
        data: { error: `${Object.keys(error.keyValue)[0]} already exists.` },
      };
    }
    return {
      success: false,
      status: 500,
      data: { error: "Something went wrong." },
    };
  }
};

module.exports = {
  getUser,
  getUsers,
  updateUser,
};
