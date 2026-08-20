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

    // 1. Create notification in database
    const notification =
        await prisma.notification.create({
            data: {
                userId,
                journeyId,
                type,
                channel: "EMAIL",
                status: "PENDING",
                message
            }
        });


    // 2. Send notification to trusted contacts
    const deliveryResults =
        await deliverNotification({
            userId,
            subject: `SafeReach - ${type}`,
            message
        });


    // 3. Check whether at least one email was sent
    const emailSent =
        deliveryResults.some(
            result =>
                result.result &&
                result.result.success
        );


    // 4. Update notification status
    const updatedNotification =
        await prisma.notification.update({
            where: {
                id: notification.id
            },
            data: {
                status: emailSent ? "SENT" : "FAILED",
                sentAt: emailSent
                    ? new Date()
                    : null
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