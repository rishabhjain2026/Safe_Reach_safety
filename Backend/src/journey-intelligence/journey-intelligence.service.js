const prisma = require("../config/prisma");

const {calculateDistance} = require("./geo.service");


// analyze distance from origin and destination ai intelligence
const analyzeLocation = async (journeyId,currentLocation) => {
    const journey = await prisma.journey.findUnique({
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

    const distanceFromOrigin = calculateDistance(
        journey.origin.latitude,
        journey.origin.longitude,
        currentLocation.latitude,
        currentLocation.longitude
    );

    const distanceFromDestination = calculateDistance(
        journey.destination.latitude,
        journey.destination.longitude,
        currentLocation.latitude,
        currentLocation.longitude
    );
    console.log("distance from origin",distanceFromOrigin)
    console.log("distance from destination", distanceFromDestination)

    return {
        journeyId: journey.id,
        distanceFromOrigin,
        distanceFromDestination
    };
};

module.exports = {
    analyzeLocation
};