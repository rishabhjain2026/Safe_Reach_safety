const prisma = require("../config/prisma");

const {
    deliverNotification
} = require("../messaging/delivery.service");


const MAX_RETRIES = 3;


const retryFailedNotifications = async () => {

    const notifications =
        await prisma.notification.findMany({
            where: {
                status: "FAILED",

                retryCount: {
                    lt: MAX_RETRIES
                }
            },

            orderBy: {
                createdAt: "asc"
            },

            take: 10
        });


    console.log(
        `Found ${notifications.length} failed notifications to retry`
    );


    for (const notification of notifications) {

        console.log(
            `Retrying notification ${notification.id}`
        );


        const deliveryResults =
            await deliverNotification({
                userId: notification.userId,

                subject:
                    `SafeReach - ${notification.type}`,

                message:
                    notification.message
            });


        const emailSent =
            deliveryResults.some(
                result =>
                    result.result &&
                    result.result.success
            );


        if (emailSent) {

            await prisma.notification.update({
                where: {
                    id: notification.id
                },

                data: {
                    status: "SENT",

                    sentAt: new Date(),

                    lastError: null
                }
            });


            console.log(
                `Notification ${notification.id} sent successfully`
            );

        } else {

            await prisma.notification.update({
                where: {
                    id: notification.id
                },

                data: {

                    retryCount: {
                        increment: 1
                    },

                    lastError:
                        "Email delivery failed"
                }
            });


            console.log(
                `Retry failed for notification ${notification.id}`
            );
        }
    }
};


module.exports = {
    retryFailedNotifications
};