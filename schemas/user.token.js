const mongoose = require('mongoose');
const config = require('../config/environment.dev.json');

const UserTokenSchema = new mongoose.Schema({
  email: String,
  refreshToken: String,
});

const UserToken = mongoose.model(config.mongo.collection.TOKENS, UserTokenSchema);

module.exports = UserToken;
