const express = require("express");
const router = express.Router();

const HeartbeatController = require("../controllers/heartbeat.controller");

router.get("/check", HeartbeatController.checkHeartbeat);

module.exports = router;
