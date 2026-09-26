const prisma = require("../config/prisma");

const {
    analyzeJourneySafety
} = require("../journey-intelligence/safety.service");


const processHeartbeat = async (
    journeyId,
    userId
) => {

    // Find the journey and make sure it belongs
    // to the currently logged-in user.
    const journey =
        await prisma.journey.findFirst({
            where: {
                id: journeyId,
                userId,
                status: {
                    in: [
                        "PLANNED",
                        "ACTIVE"
                    ]
                }
            }
        });


    if (!journey) {
        throw new Error(
            "Journey not found or cannot receive heartbeat"
        );
    }


    const now = new Date();


    // Record that the device is currently communicating.
    const updatedJourney =
        await prisma.journey.update({
            where: {
                id: journeyId
            },

            data: {
                lastHeartbeatAt: now,
                deviceStatus: "CONNECTED"
            }
        });


    // Recalculate the current safety condition.
    const safetyAnalysis =
        await analyzeJourneySafety(
            journeyId
        );


    return {
        lastHeartbeatAt:
            updatedJourney.lastHeartbeatAt,

        deviceStatus:
            updatedJourney.deviceStatus,

        safetyAnalysis
    };
};


module.exports = {
    processHeartbeat
};