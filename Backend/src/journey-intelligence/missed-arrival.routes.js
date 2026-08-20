const express = require("express");

const router = express.Router();

const {
    testMissedArrivals
} = require("./missed-arrival.controller");


router.post(
    "/test",
    testMissedArrivals
);


module.exports = router;