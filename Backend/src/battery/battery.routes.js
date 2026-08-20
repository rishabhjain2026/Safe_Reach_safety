const express = require("express");

const router = express.Router();

const {
    receiveBattery
} = require("./battery.controller");


router.post(
    "/",
    receiveBattery
);


module.exports = router;