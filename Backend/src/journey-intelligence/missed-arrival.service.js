const prisma = require("../config/prisma");

const { createAndDeliverNotification } = require("../notifications/notification-event.service");


const GRACE_PERIOD_MINUTES = 10;


const checkMissedArrivals = async () => {

    const now = new Date();

    const graceTime =
        new Date(
            now.getTime() -
            GRACE_PERIOD_MINUTES * 60 * 1000
        );


    const journeys =
        await prisma.journey.findMany({
            where: {
                status: "ACTIVE",

                expectedArrival: {
                    lt: graceTime
                }
            },

            include: {
                origin: true,
                destination: true
            }
        });


    for (const journey of journeys) {

        const existingNotification =
            await prisma.notification.findFirst({
                where: {
                    journeyId: journey.id,

                    type: "MISSED_ARRIVAL"
                }
            });


        if (existingNotification) {
            continue;
        }


        const message = `
SafeReach — Missed Arrival Alert

The expected arrival time for the journey from ${journey.origin.name} to ${journey.destination.name} has passed.

The traveler has not yet been detected at the destination.

SafeReach is continuing to monitor the journey.

Please check on the traveler if necessary.

— SafeReach
`;


        await createAndDeliverNotification({
            userId: journey.userId,
            journeyId: journey.id,
            type: "MISSED_ARRIVAL",
            message
        });
    }
};


module.exports = {
    checkMissedArrivals
};