const prisma = require("../config/prisma");

const {
    deliverNotification
} = require("../messaging/delivery.service");


const createAndDeliverNotification = async ({
    userId,
    journeyId,
    type,
    message
}) => {

    // 1. Create notification
    const notification =
        await prisma.notification.create({
            data: {
                userId,
                journeyId,
                type,
                channel: "EMAIL",
                status: "PENDING",
                message,
                retryCount: 0
            }
        });


    // 2. Try to deliver notification
    const deliveryResults =
        await deliverNotification({
            userId,
            subject: `SafeReach - ${type}`,
            message
        });


    console.log(
        "Notification delivery results:",
        JSON.stringify(deliveryResults, null, 2)
    );


    // 3. Check whether at least one email succeeded
    const emailSent =
        deliveryResults.some(
            result =>
                result.result &&
                result.result.success
        );









//         What changed?

// Previously, if email failed:

// FAILED

// and that was basically all we knew.

// Now we'll store:

// status      = FAILED
// retryCount  = 1
// lastError   = actual error

// For a successful email:

// status      = SENT
// retryCount  = 0
// lastError   = null
// sentAt      = current time




    // 4. Extract error if delivery failed
    let lastError = null;

    if (!emailSent) {

        const failedResult =
            deliveryResults.find(
                result =>
                    result.result &&
                    !result.result.success
            );

        if (failedResult) {
            lastError =
                failedResult.result.error ||
                failedResult.result.message ||
                "Email delivery failed";
        } else {
            lastError =
                "No email was delivered";
        }
    }


    // 5. Update notification
    const updatedNotification =
        await prisma.notification.update({
            where: {
                id: notification.id
            },

            data: {

                status:
                    emailSent
                        ? "SENT"
                        : "FAILED",

                sentAt:
                    emailSent
                        ? new Date()
                        : null,

                lastError,

                retryCount:
                    emailSent
                        ? 0
                        : 1
            }
        });


    return {
        notification: updatedNotification,
        deliveryResults
    };
};


module.exports = {
    createAndDeliverNotification
};