const { body, validationResult } = require("express-validator");

const createJourneyValidation = [
    body("originId")
        .notEmpty()
        .withMessage("Origin place is required")
        .isInt({ min: 1 })
        .withMessage("Origin place ID must be a valid number"),

    body("destinationId")
        .notEmpty()
        .withMessage("Destination place is required")
        .isInt({ min: 1 })
        .withMessage("Destination place ID must be a valid number"),

    body("plannedDeparture")
        .notEmpty()
        .withMessage("Planned departure time is required")
        .isISO8601()
        .withMessage("Planned departure must be a valid date"),

    body("expectedDuration")
        .notEmpty()
        .withMessage("Expected duration is required")
        .isInt({ min: 1 })
        .withMessage("Expected duration must be at least 1 minute")
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


const updateJourneyValidation = [
    body("originId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Origin place ID must be a valid number"),

    body("destinationId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Destination place ID must be a valid number"),

    body("plannedDeparture")
        .optional()
        .isISO8601()
        .withMessage("Planned departure must be a valid date"),

    body("expectedDuration")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Expected duration must be at least 1 minute")
];

module.exports = {
    createJourneyValidation,
    validateRequest,
    updateJourneyValidation
};