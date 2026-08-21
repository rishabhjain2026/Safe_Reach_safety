const prisma = require("../config/prisma"); 

const LOCATION_WARNING_MINUTES = 2;
const LOCATION_CRITICAL_MINUTES = 5;


const calculateMinutesSince = (date) => {

    if (!date) {
        return null;
    }


// lastLocationAt = 6:00 PM
// current time = 6:03 PM
// We calculate:
// 3 minutes

    const now = new Date();

    const difference =
        now.getTime() - new Date(date).getTime();

    return difference / (1000 * 60);
};


const analyzeSafetyState = ({
    batteryPercentage,
    deviceStatus,
    lastHeartbeatAt,
    lastLocationAt
}) => {

    const minutesSinceHeartbeat =
        calculateMinutesSince(lastHeartbeatAt);

    const minutesSinceLocation =
        calculateMinutesSince(lastLocationAt);


    /*
     * CRITICAL CONDITIONS
     */

    if (
        deviceStatus === "UNREACHABLE" &&
        minutesSinceLocation !== null &&
        minutesSinceLocation >= LOCATION_CRITICAL_MINUTES
    ) {

        return {
            state: "CRITICAL",
            reason:
                "Device is unreachable and location data is stale"
        };
    }


    if (
        batteryPercentage !== null &&
        batteryPercentage <= 10
    ) {

        return {
            state: "CRITICAL",
            reason:
                "Device battery is critically low"
        };
    }


    /*
     * WARNING CONDITIONS
     */

    if (
        batteryPercentage !== null &&
        batteryPercentage <= 20
    ) {

        return {
            state: "WARNING",
            reason:
                "Device battery is low"
        };
    }


    if (
        minutesSinceLocation !== null &&
        minutesSinceLocation >= LOCATION_WARNING_MINUTES
    ) {

        return {
            state: "WARNING",
            reason:
                "Location data has not been updated recently"
        };
    }


    /*
     * MONITORING
     */

    if (
        minutesSinceHeartbeat !== null &&
        minutesSinceHeartbeat >= 1
    ) {

        return {
            state: "MONITORING",
            reason:
                "Heartbeat was received recently but not continuously"
        };
    }


    /*
     * NORMAL
     */

    return {
        state: "SAFE",
        reason:
            "Device, battery and location are operating normally"
    };
};


const analyzeJourneySafety = async (journeyId) => {

    const journey =
        await prisma.journey.findUnique({
            where: {
                id: journeyId
            }
        });


    if (!journey) {
        throw new Error("Journey not found");
    }


    const safety =
        analyzeSafetyState({
            batteryPercentage:
                journey.batteryPercentage,

            deviceStatus:
                journey.deviceStatus,

            lastHeartbeatAt:
                journey.lastHeartbeatAt,

            lastLocationAt:
                journey.lastLocationAt
        });


    return {
        journeyId: journey.id,

        state: safety.state,

        reason: safety.reason,

        batteryPercentage:
            journey.batteryPercentage,

        deviceStatus:
            journey.deviceStatus,

        lastHeartbeatAt:
            journey.lastHeartbeatAt,

        lastLocationAt:
            journey.lastLocationAt
    };
};


module.exports = {
    analyzeSafetyState,
    analyzeJourneySafety
};



// console.log(
//     analyzeSafetyState({
//         batteryPercentage: 50,
//         deviceStatus: "CONNECTED",
//         lastHeartbeatAt: new Date(),
//         lastLocationAt: new Date()
//     })
// );