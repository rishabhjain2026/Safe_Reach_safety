const express = require("express");

const {authenticate} = require("../middleware/auth.validation");

const { createContact } = require("./contact.controller");

const {
  createContactValidation,
  validateRequest,
} = require("./contact.validator");

const router = express.Router();

router.post("/",authenticate,createContactValidation,validateRequest,createContact);

module.exports = router;
