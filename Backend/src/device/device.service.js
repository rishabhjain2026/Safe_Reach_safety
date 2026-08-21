const prisma = require("../config/prisma");

const {
    analyzeJourneySafety
} = require("../journey-intelligence/safety.service");


const processHeartbeat = async (journeyId) => {

    const journey =
        await prisma.journey.findUnique({
            where: {
                id: journeyId
            }
        });


    if (!journey) {
        throw new Error("Journey not found");
    }


    if (journey.status !== "ACTIVE") {
        throw new Error(
            "Heartbeat can only be received for an active journey"
        );
    }


    const now = new Date();


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
    const safetyAnalysis =
    await analyzeJourneySafety(journeyId);

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