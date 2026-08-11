const express = require("express");

const {authenticate} = require("../middleware/auth.validation");

const { createContact,getContacts,getcontactbyid,updateContact,deleteContact} = require("./contact.controller");

const {
  createContactValidation,
  validateRequest,
} = require("./contact.validator");

const router = express.Router();

router.post("/",authenticate,createContactValidation,validateRequest,createContact);

router.get("/",authenticate,getContacts);

router.get("/:id",authenticate,getcontactbyid);

router.put("/:id",authenticate,updateContact);

router.delete("/:id",authenticate,deleteContact);

module.exports = router;
