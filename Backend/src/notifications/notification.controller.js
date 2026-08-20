const {
    getNotificationRecipients
} = require("./recipient.service");

const {
    deliverNotification
} = require("../messaging/delivery.service");

const {
    createAndDeliverNotification
} = require("./notification-event.service");

const getRecipients = async (req, res) => {

    try {

        const userId = Number(req.params.userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const contacts =
            await getNotificationRecipients(userId);

        return res.status(200).json({
            success: true,
            data: contacts
        });

    } catch (error) {

        console.error(
            "Error getting notification recipients:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get notification recipients"
        });
    }
};

const testNotificationDelivery = async (req, res) => {

    try {

        const userId =
            Number(req.params.userId);

        const results =
            await deliverNotification({
                userId,
                subject: "SafeReach - Test Notification",
                message:
                    "Test notification from SafeReach."
            });

        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {

        console.error(
            "Notification delivery error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Notification delivery failed"
        });
    }
};

const createTestEvent = async (req, res) => {

    try {

        const userId =
            Number(req.params.userId);

        const journeyId =
            Number(req.body.journeyId);

        const result =
            await createAndDeliverNotification({
                userId,
                journeyId,
                type: "DELAY_DETECTED",
                message:
                    "SafeReach detected that your journey is running late. Your estimated arrival time has changed."
            });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Notification event error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create notification"
        });
    }
};

module.exports = {
    getRecipients,
    testNotificationDelivery,
    createTestEvent
};