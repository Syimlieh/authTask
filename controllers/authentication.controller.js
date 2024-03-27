const passport = require("passport");
const AuthService = require("../services/authentication.service");
const { USER_ROLES } = require("../utils/constants.utils");
require("../strategy/google");

const { formatResponse } = require("../utils/general.utils");

const register = async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "Resgister User"
  /*
    #swagger.parameters['obj'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: 'Register details',
      schema: {
        $name: "John Doe",
        $email: "admin@voosh.in",
        $mobile: "9898767898",
        $bio: "Bio details",
        $password: "Password1@"
      }
    }
  */
  const payload = req.body;

  payload.userRole = payload.userRole || USER_ROLES.END_USER;
  const result = await AuthService.createUser(payload);
  return formatResponse(res, result, result.status);
};

const login = async (req, res) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "Login User"
  /*
    #swagger.parameters['obj'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: 'Login details',
      schema: {
        $email: "admin@voosh.com",
        $password: "Password1@"
      }
    }
  */
  const payload = req.body;
  const result = await AuthService.login(payload);
  return formatResponse(res, result, result.status);
};

const googleLogin = async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "Google Login"

  // this should redirect to the googleRedirect to call the passport authenticate
  console.log("inside google login");
  res.send('<a href="/api/v1/auth/google">Google Login</a>');
};

const googleLoginRedirect = async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "Google Login"

  passport.authenticate("google", { scope: ["email", "profile"], prompt: "consent", accessType: 'offline' })(req, res, next);
};

const googleLoginCallback = async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "Google Login"
  console.log("inside google login callback--");
  passport.authenticate("google", {
    successRedirect: "/api/v1/auth/success",
    failureRedirect: "/api/v1/auth/fail",
  })(req, res, next);
};

const authSuccess = async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "Auth Success"
  const { accessToken = "", refreshToken ="" } = req?.user?.tokens;
  const resBody = {
    success: true,
    data: {
      access_token: accessToken,
      accessExpiresIn: 3600,
      refresh_token: refreshToken,
      refreshExpiresIn: 4200,
    },
  };
  formatResponse(res, resBody, 200);
};

const authFail = async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = "Auth Failed"
  formatResponse(res, { error: "Something Went Wrong." }, 500);
};

const logout = async (req, res) => {
  // #swagger.tags = ['Authentication']
  /*
    #swagger.description = 'Logging out user'
    #swagger.security = [{
        "jwtRefreshToken": []
    }],
  */
  await AuthService.logout(req.userToken);
  formatResponse(res, { message: "Logout successfully" });
};

module.exports = {
  register,
  login,
  googleLogin,
  googleLoginRedirect,
  googleLoginCallback,
  authSuccess,
  authFail,
  logout,
};
