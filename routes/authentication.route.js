const express = require("express");
const router = express.Router();

const Validator = require("../validation/Validator");
const AuthenticationController = require("../controllers/authentication.controller");
const { verifyRefreshToken } = require("../utils/jwt.utils");

router.post(
  "/register",
  Validator("authRegisterValidation"),
  AuthenticationController.register
);

router.post(
  "/login",
  Validator("authLoginValidation"),
  AuthenticationController.login
);

router.get(
  "/",
  AuthenticationController.googleLogin
);

router.get(
  "/google",
  AuthenticationController.googleLoginRedirect
);

router.get(
  "/google/callback",
  AuthenticationController.googleLoginCallback
);

router.get(
  "/success",
  AuthenticationController.authSuccess
);

router.get(
  "/fail",
  AuthenticationController.authFail
);

router.post(
  "/logout",
  verifyRefreshToken,
  AuthenticationController.logout
);

module.exports = router;
