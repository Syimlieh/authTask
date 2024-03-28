const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const passport = require("passport");
const session = require('express-session');
const rateLimit = require("express-rate-limit");
const swaggerFile = require("./swagger_output.json");
const { getUrl } = require("./config/mongo.config");

const server = express();

// PORT
const PORT = process.env.PORT || 4000;

// CORS
server.use(cors());

// should be before passport
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

server.use(passport.initialize());

server.use(passport.session());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later",
  statusCode: 429,
});

// Apply the rate limiter middleware to all requests
server.use(limiter);

server.listen(PORT, () => {
  console.log(`Backend Server running on PORT: [${PORT}]`);
});

// Swagger
server.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.use(express.json());
server.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Mongo
const mongoUrl = getUrl();
console.log("mongoUrl", mongoUrl);
mongoose
  .connect(mongoUrl, {
    authSource: "admin",
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Failed to connect to Database:\n" + err));
const db = mongoose.connection;
db.on("open", () => {
  console.log("Connection established.");
});

require("./routes")(server);

// Response for Non existant routes
server.use("*", (req, res) => {
  console.log('req.url', req.url)
  const message = "You reached a route that is not defined on this server.";
  return res.status(404).json({
    message,
  });
});
