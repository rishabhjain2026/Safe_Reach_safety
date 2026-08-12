const express = require("express");

const {authenticate} = require("../middleware/auth.validation");

const {createPlace,getPlaces} = require("./place.controller");

const {createPlaceValidation,validateRequest} = require("./place.validator");

const router = express.Router();

router.post("/",authenticate,createPlaceValidation,validateRequest,createPlace);

router.get("/",authenticate,getPlaces);

module.exports = router;