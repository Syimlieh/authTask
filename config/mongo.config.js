require("dotenv").config();

function getUrl() {
  let URL = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`;
  return URL;
}

module.exports = {
  getUrl,
};
