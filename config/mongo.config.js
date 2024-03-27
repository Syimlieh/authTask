require("dotenv").config();

function getUrl() {
  let URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.svwucke.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`;
  return URL;
}

module.exports = {
  getUrl,
};
