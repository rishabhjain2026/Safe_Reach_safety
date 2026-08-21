const prisma = require("../config/prisma");

const {createAndDeliverNotification} = require("../notifications/notification-event.service");

const {
    analyzeJourneySafety
} = require("../journey-intelligence/safety.service");


const LOW_BATTERY_THRESHOLD = 20;
const CRITICAL_BATTERY_THRESHOLD = 10;


const getBatteryStatus = (batteryPercentage) => {

    if (batteryPercentage <= CRITICAL_BATTERY_THRESHOLD) {
        return "CRITICAL";
    }

    if (batteryPercentage <= LOW_BATTERY_THRESHOLD) {
        return "LOW";
    }

    return "NORMAL";
};


const processBattery = async (
    journeyId,
    batteryPercentage
) => {

    const battery = Number(batteryPercentage);

    if (
        Number.isNaN(battery) ||
        battery < 0 ||
        battery > 100
    ) {
        throw new Error(
            "Battery percentage must be between 0 and 100"
        );
    }


    const journey =
        await prisma.journey.findUnique({
            where: {
                id: journeyId
            },

            include: {
                origin: true,
                destination: true
            }
        });


    if (!journey) {
        throw new Error("Journey not found");
    }


    const previousBattery =
        journey.batteryPercentage;


    const previousStatus =
        journey.batteryStatus;


    const batteryStatus =
        getBatteryStatus(battery);


    await prisma.journey.update({
        where: {
            id: journeyId
        },

        data: {
            batteryPercentage: battery,
            batteryStatus
        }
    });

    const safetyAnalysis =
    await analyzeJourneySafety(journeyId);


    /*
     * Send notification only when
     * the battery enters a new warning state.
     */

    if (
        batteryStatus === "LOW" &&
        previousStatus !== "LOW" &&
        previousStatus !== "CRITICAL"
    ) {

        const message = `
SafeReach — Low Battery Alert

The battery level of the traveler's device is now ${battery}%.

Journey:
${journey.origin.name} → ${journey.destination.name}

The journey is currently being monitored by SafeReach.

A low battery may affect the ability to continue receiving location updates.

— SafeReach
`;


        await createAndDeliverNotification({
            userId: journey.userId,
            journeyId: journey.id,
            type: "LOW_BATTERY",
            message
        });
    }


    if (
        batteryStatus === "CRITICAL" &&
        previousStatus !== "CRITICAL"
    ) {

        const message = `
SafeReach — Critical Battery Alert

The battery level of the traveler's device is critically low at ${battery}%.

Journey:
${journey.origin.name} → ${journey.destination.name}

If the device powers off, SafeReach may no longer be able to receive location updates.

Please check on the traveler if necessary.

— SafeReach
`;


        await createAndDeliverNotification({
            userId: journey.userId,
            journeyId: journey.id,
            type: "CRITICAL_BATTERY",
            message
        });
    }


    return {
        batteryPercentage: battery,
        batteryStatus,
        safetyAnalysis
    };
};


module.exports = {
    processBattery,
    getBatteryStatus
};