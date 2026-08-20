const express = require("express");

const {
    getRecipients,
    testNotificationDelivery,
    createTestEvent
} = require("./notification.controller");

const router = express.Router();

router.get("/recipients/:userId",getRecipients);

router.post(
    "/test-delivery/:userId",
    testNotificationDelivery
);

router.post(
    "/test-event/:userId",
    createTestEvent
);

module.exports = router;