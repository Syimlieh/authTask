const bcrypt = require("bcrypt");
const JWTUtil = require("../utils/jwt.utils");

const Users = require("../schemas/user");
const UserToken = require("../schemas/user.token");

const createUser = async (data) => {
  try {
    const userReq = new Users(data);
    await userReq.save();

    return {
      success: true,
      status: 200,
      data: {
        message: 'Registered Successfull.',
      },
    };
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return { success: false, code: 400, data: { error: `${Object.keys(error.keyValue)[0]} already exists.` } };
    }
    return {
      success: false, status: 500, data: { error: 'Failed while signing up. Please check details.' },
    };
  }
};

const login = async (loginData) => {
  try {
  const { email, password } = loginData;
  const user = await Users.findOne({ email: { $regex: new RegExp(`^${email}`, 'i') } }).select('+password')
    if (!user) { return { success: false, code: 401, data: { error: 'Authentication failed' } }; }
  
    const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return { success: false, code: 401, data: { error: 'Authentication failed' } };
  }
  const token = await JWTUtil.generateToken(user.email);
    let userToken = await UserToken.findOne({ email: user.email });
    const refreshToken = await JWTUtil.generateRefreshToken(user.email);
    if (userToken) {
      userToken.refreshToken = refreshToken;
    } else {
      userToken = new UserToken({
        email: user.email,
        refreshToken,
      });
    }
    await userToken.save();
    return {
      success: true,
      data: {
        access_token: token,
        accessExpiresIn: 3600,
        refresh_token: refreshToken,
        refreshExpiresIn: 4200,
      },
    };
  } catch (err) {
    return { success: false, code: 401, data: { error: 'Authentication failed' } };
  }
};

const logout = async (userToken) => {
  await UserToken.findOneAndUpdate({ email: userToken?.email }, { $unset: { refreshToken: 1 } });
};

module.exports = {
  createUser,
  login,
  logout,
};
