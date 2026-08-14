const prisma = require("../config/prisma");

const {analyzeLocation} = require("../journey-intelligence/journey-intelligence.service");

const processLocation = async (userId, locationData) => {

    const journey = await prisma.journey.findFirst({
        where: {
            userId,
            status: "PLANNED"
        },
        orderBy: {
            plannedDeparture: "asc"
        }
    });

    if (!journey) {
        throw new Error("No planned journey found");
    }

    const location = await prisma.journeyLocation.create({
        data: {
            journeyId: journey.id,
            latitude: Number(locationData.latitude),
            longitude: Number(locationData.longitude),
            accuracy:
                locationData.accuracy !== undefined
                    ? Number(locationData.accuracy)
                    : null,
            speed:
                locationData.speed !== undefined
                    ? Number(locationData.speed)
                    : null,
            recordedAt: new Date(locationData.timestamp)
        }
    });

    const analysis = await analyzeLocation(
    journey.id,
        {
            latitude: Number(locationData.latitude),
            longitude: Number(locationData.longitude)
        }
    );

    return {
        journey,
        location,
        analysis
    };
};

module.exports = {
    processLocation
};