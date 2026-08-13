const { body, validationResult } = require("express-validator");

const createPlaceValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Place name is required")
        .isLength({ min: 2 })
        .withMessage("Place name must be at least 2 characters"),

    body("latitude")
        .notEmpty()
        .withMessage("Latitude is required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Invalid latitude"),

    body("longitude")
        .notEmpty()
        .withMessage("Longitude is required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Invalid longitude"),

    body("address")
        .optional()
        .trim()
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
    createPlaceValidation,
    validateRequest
};