const HeartbeatRoutes = require("./routes/heartbeat.route");
const AuthenticationRoutes = require("./routes/authentication.route");
const UserRoutes = require("./routes/user.route");

module.exports = (server) => {
  server.use("/api/v1/heartbeat", HeartbeatRoutes);

  server.use("/api/v1/auth", AuthenticationRoutes);

  server.use("/api/v1/user", UserRoutes);
};
