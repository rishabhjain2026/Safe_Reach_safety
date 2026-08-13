const express = require("express");

const {authenticate} = require("../middleware/auth.validation");

const {createJourney,getJourneys,getJourneyById,updateJourney,cancelJourney} = require("./journey.controller");



const {createJourneyValidation,updateJourneyValidation,validateRequest} = require("./journey.validator");

const router = express.Router();

router.post("/",authenticate,createJourneyValidation,validateRequest,createJourney);

router.get("/",authenticate,getJourneys);

router.get("/:id",authenticate,getJourneyById);

router.put("/:id",authenticate,updateJourneyValidation,validateRequest,updateJourney);

router.patch("/:id/cancel", authenticate, cancelJourney);

module.exports = router;