require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const UserToken = require("../schemas/user.token");
const { formatResponse } = require("./general.utils");

const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

async function generateToken(userData) {
  return jwt.sign(
    {
      data: userData,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
}

async function generateRefreshToken(userData) {
  return jwt.sign(
    {
      data: userData,
    },
    refreshTokenSecret,
    { expiresIn: "70m" }
  );
}

// eslint-disable-next-line consistent-return
async function verifyToken(req, res, next) {
  if (req.headers.authorization) {
    const tokenData = await jwt.verify(
      req.headers.authorization,
      jwtSecret,
      (err, token) => {
        let returnValue;
        if (!err) {
          returnValue = token;
        }
        return returnValue;
      }
    );
    if (!tokenData) {
      return formatResponse(res, { error: "Invalid access token" }, 401);
    }
    const user = await User.findOne({ email: tokenData.data }, { password: 0 });
    if (user) {
      req.user = user;
      next();
    } else {
      formatResponse(res, { error: "Token doesn't exist" }, 401);
    }
  } else {
    formatResponse(res, { error: "Authorization not found" }, 401);
  }
}

// eslint-disable-next-line consistent-return
async function verifyRefreshToken(req, res, next) {
  if (req.headers.refresh) {
    const tokenData = jwt.verify(
      req.headers.refresh,
      refreshTokenSecret,
      (err, token) => {
        let returnValue;
        if (!err) {
          returnValue = token;
        }
        return returnValue;
      }
    );
    if (!tokenData) {
      return formatResponse(res, { error: "Refresh token Invalid" }, 401);
    }
    const userToken = await UserToken.findOne({
      email: tokenData.data,
      refreshToken: req.headers.refresh,
    });
    if (userToken) {
      const user = await User.findOne(
        { email: tokenData.data },
        { password: 0 }
      );
      if (user) {
        req.userToken = userToken;
        next();
      } else {
        formatResponse(res, { error: "Token doesn't exist" }, 401);
      }
    } else {
      formatResponse(res, { error: "Token not found in database" }, 401);
    }
  } else {
    formatResponse(res, { error: "Refresh token not found" }, 401);
  }
}

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
