const express = require("express");

const {authenticate} = require("../middleware/auth.validation");

const {receiveLocation} = require("./tracking.controller");

const {locationValidation,validateRequest} = require("./tracking.validator");

const router = express.Router();

router.post("/location",authenticate,locationValidation,validateRequest,receiveLocation);

module.exports = router;