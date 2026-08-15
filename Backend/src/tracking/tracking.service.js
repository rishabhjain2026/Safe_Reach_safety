const prisma = require("../config/prisma");

const {analyzeLocation,analyzeMovement,analyzeDirection} = require("../journey-intelligence/journey-intelligence.service");

const {calculateDistance} = require("../journey-intelligence/geo.service");

const processLocation = async (userId, locationData) => {

    const journey = await prisma.journey.findFirst({
        where: {
            userId,
            status: "PLANNED"
        },
        orderBy: {
            plannedDeparture: "asc"
        },
        include: {
            origin: true,
            destination: true
        }
    });

    if (!journey) {
        throw new Error("No planned journey found");
    }
    console.log("journey",journey)

    const currentRecordedAt =
    new Date(locationData.timestamp);

    const previousLocation =
        await prisma.journeyLocation.findFirst({
            where: {
                journeyId: journey.id
            },
            orderBy: {
                recordedAt: "desc"
            }
        });

        console.log("Received timestamp:", locationData.timestamp);
console.log("Parsed timestamp:", new Date(locationData.timestamp));


console.log("CURRENT LOCATION TIME:", currentRecordedAt);
console.log("PREVIOUS LOCATION:", previousLocation);

    const location =
        await prisma.journeyLocation.create({
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

                recordedAt:
                    new Date(locationData.timestamp)
            }
        });

    const analysis = await analyzeLocation(
        journey.id,
        {
            latitude: location.latitude,
            longitude: location.longitude
        }
    );

    const movementAnalysis = analyzeMovement(previousLocation,location);

    console.log("journey_destination_latitude",journey.destination.latitude)


    let previousDistanceFromDestination = null;

    if (previousLocation) {
        previousDistanceFromDestination =
            calculateDistance(
                previousLocation.latitude,
                previousLocation.longitude,
                journey.destination.latitude,
                journey.destination.longitude
            );
    }

    const directionAnalysis =analyzeDirection(previousDistanceFromDestination,analysis.distanceFromDestination);

    return {
        journey,
        location,
        analysis,
        movementAnalysis,
        directionAnalysis
    };
};

module.exports = {
    processLocation
};