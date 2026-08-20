const express = require("express");

const router = express.Router();

const {
    receiveHeartbeat
} = require("./device.controller");

const {
    testUnreachableDevices
} = require("./device-monitor.controller");


router.post(
    "/heartbeat",
    receiveHeartbeat
);

router.post(
    "/check-unreachable",
    testUnreachableDevices
);


module.exports = router;