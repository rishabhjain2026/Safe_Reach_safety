const prisma = require("../config/prisma");

const createNotification = async ({
    userId,
    journeyId,
    type,
    channel,
    message
}) => {

    const notification =
        await prisma.notification.create({
            data: {
                userId,
                journeyId,
                type,
                channel,
                message,
                status: "PENDING"
            }
        });

    return notification;
};

module.exports = {
    createNotification
};