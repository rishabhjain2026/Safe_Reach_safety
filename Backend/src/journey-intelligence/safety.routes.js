const express = require("express");

const router = express.Router();

const {
    getJourneySafety
} = require("./safety.controller");


router.get("/:journeyId",getJourneySafety);


module.exports = router;