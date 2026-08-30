const { body,validationResult} = require("express-validator");

const locationValidation = [
    body("journeyId")
    .isInt({ min: 1 })
    .withMessage(
        "Journey ID must be a valid number"
    ),
    body("latitude")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),

    body("longitude")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180"),

    body("accuracy")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Accuracy must be a positive number"),

    body("speed")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Speed must be a positive number"),

    body("timestamp")
        .isISO8601()
        .withMessage("Timestamp must be a valid date"),

    body("batteryLevel")
        .optional({ nullable: true })
        .isFloat({ min: 0, max: 100 })
        .withMessage(
            "Battery level must be between 0 and 100"
        ),

    body("isCharging")
        .optional({ nullable: true })
        .isBoolean()
        .withMessage(
            "Charging status must be true or false"
        ),
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
    locationValidation,
    validateRequest
};