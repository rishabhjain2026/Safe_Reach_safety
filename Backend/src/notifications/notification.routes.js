const express = require("express");

const {
    getRecipients,
    testNotificationDelivery
} = require("./notification.controller");

const router = express.Router();

router.get("/recipients/:userId",getRecipients);

router.post(
    "/test-delivery/:userId",
    testNotificationDelivery
);

module.exports = router;