const express = require("express");
const authController = require("../controllers/auth.controller");
const {authenticate} = require("../middleware/auth.validation");
 
const{registerValidation,loginValidation ,validateRequest} = require("../middleware/auth.validation");
const router = express.Router();

router.post("/register",registerValidation,validateRequest,authController.register);
router.post("/login",loginValidation,validateRequest,authController.login);
router.get("/me",authenticate,authController.getMe);

module.exports = router;