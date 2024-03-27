const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLES, USER_VISIBILITY } = require('../utils/constants.utils');
const config = require('../config/environment.dev.json');

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    profile: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    visibility: {
      type: String,
      enum: Object.values(USER_VISIBILITY),
      default: USER_VISIBILITY.PRIVATE
    },
    userRole: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.END_USER
    },
  },
  { timestamps: true, optimisticConcurrency: true },
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, config.encryption.salt_rounds);
});

const User = mongoose.model(config.mongo.collection.USER, UserSchema);

module.exports = User;
