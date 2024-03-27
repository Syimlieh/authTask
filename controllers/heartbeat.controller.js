const mongoose = require("mongoose");
const { formatResponse } = require("../utils/general.utils");

const checkHeartbeat = async (req, res) => {
  // #swagger.tags = ['Check Heartbeat']
  const stats = await mongoose.connection.db.stats();
  return formatResponse(res, stats)
};

module.exports = { checkHeartbeat };
