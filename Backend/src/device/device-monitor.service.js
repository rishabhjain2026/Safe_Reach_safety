const prisma = require("../config/prisma");

const {createAndDeliverNotification} = require("../notifications/notification-event.service");

// Step 2 — Understand what we're doing

// This is the important condition:

// lastHeartbeatAt: {
//     lt: timeoutTime
// }

// Suppose:

// Current time = 3:00 PM

// Our timeout is:

// 2 minutes

// Therefore:

// timeoutTime = 2:58 PM

// If the device's last heartbeat was:

// 2:55 PM

// then:

// 2:55 < 2:58

// So the device is considered unreachable.

// But if:

// lastHeartbeatAt = 2:59 PM

// then the device is still considered reachable.



const HEARTBEAT_TIMEOUT_MINUTES = 2;



const checkUnreachableDevices = async () => {

    const now = new Date();

    const timeoutTime =
        new Date(
            now.getTime() -
            HEARTBEAT_TIMEOUT_MINUTES * 60 * 1000
        );

    const journeys =
        await prisma.journey.findMany({
            where: {
                status: "ACTIVE",

                lastHeartbeatAt: {
                    lt: timeoutTime
                },

                deviceStatus: "CONNECTED"
            },

            include: {
                origin: true,
                destination: true
            }
        });


    for (const journey of journeys) {

        await prisma.journey.update({
            where: {
                id: journey.id
            },

            data: {
                deviceStatus: "UNREACHABLE"
            }
        });


        const existingNotification =
            await prisma.notification.findFirst({
                where: {
                    journeyId: journey.id,
                    type: "DEVICE_UNREACHABLE"
                }
            });


        if (existingNotification) {
            continue;
        }


        const message = `
SafeReach — Device Unreachable Alert

SafeReach has not received a heartbeat from the traveler's device for more than ${HEARTBEAT_TIMEOUT_MINUTES} minutes.

Journey:
${journey.origin.name} → ${journey.destination.name}

The device may have lost network connectivity, been switched off, or stopped communicating with SafeReach.

Please check on the traveler if necessary.

— SafeReach
`;


        await createAndDeliverNotification({
            userId: journey.userId,
            journeyId: journey.id,
            type: "DEVICE_UNREACHABLE",
            message
        });
    }


    return {
        checkedAt: now,
        unreachableCount: journeys.length
    };
};


module.exports = {
    checkUnreachableDevices
};