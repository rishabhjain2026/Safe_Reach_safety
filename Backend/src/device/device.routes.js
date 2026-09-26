const express = require("express");

const router = express.Router();
const {
    authenticate
} = require("../middleware/auth.validation");

const {
    receiveHeartbeat
} = require("./device.controller");

const {
    testUnreachableDevices
} = require("./device-monitor.controller");


router.post(
    "/heartbeat",authenticate,
    receiveHeartbeat
);

router.post(
    "/check-unreachable",
    testUnreachableDevices
);


module.exports = router;



// React
//  ↓
// JWT
//  ↓
// POST /api/device/heartbeat
//  ↓
// authenticate
//  ↓
// req.userId
//  ↓
// processHeartbeat(journeyId, userId)