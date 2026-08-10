const { body, param, validationResult } = require("express-validator");

const createContactValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Contact name is required")
        .isLength({ min: 2 })
        .withMessage("Contact name must be at least 2 characters"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Contact phone is required")
        .isMobilePhone("any")
        .withMessage("Please provide a valid phone number"),

    body("relationship")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Relationship must be at least 2 characters"),

    body("priority")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Priority must be a positive number")
];

const validateRequest = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

module.exports = {
    createContactValidation,
    validateRequest
};