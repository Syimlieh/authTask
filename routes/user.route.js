const express = require("express");
const router = express.Router();

const Validator = require("../validation/Validator");
const UserController = require("../controllers/user.controller");
const { USER_ROLES } = require("../utils/constants.utils");
const ValidateRole = require("../utils/rbac.utils");
const { verifyToken } = require("../utils/jwt.utils");

router.get("/list", verifyToken, Validator("filterValidation", true), UserController.getUsers);

router.get("/", verifyToken, Validator("userIdValidation", true), UserController.getUser);

router.put(
  "/",
  verifyToken,
  ValidateRole(USER_ROLES.END_USER),
  Validator("userUpdateValidation"),
  UserController.updateUser
);

module.exports = router;
