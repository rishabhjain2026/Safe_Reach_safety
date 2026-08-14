const prisma = require("../config/prisma");

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

    return {
        journey,
        location
    };
};

module.exports = {
    processLocation
};