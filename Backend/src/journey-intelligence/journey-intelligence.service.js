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

const analyzeMovement = (
    previousLocation,
    currentLocation
) => {

    if (!previousLocation) {
        return {
            movementDetected: false,
            reason: "No previous location available"
        };
    }

    const distanceMoved = calculateDistance(
        previousLocation.latitude,
        previousLocation.longitude,
        currentLocation.latitude,
        currentLocation.longitude
    );

    const timeDifference =
        (
            new Date(currentLocation.recordedAt).getTime() -
            new Date(previousLocation.recordedAt).getTime()
        ) / 1000;

    if (timeDifference <= 0) {
        return {
            movementDetected: false,
            distanceMoved: 0,
            calculatedSpeed: 0,
            reason: "Invalid timestamp"
        };
    }

    const calculatedSpeed =
        distanceMoved / timeDifference;

    const movementThreshold = 1;

    const movementDetected =
        distanceMoved >= movementThreshold;

    return {
        movementDetected,
        distanceMoved,
        calculatedSpeed,
        reason: movementDetected
            ? "Movement detected"
            : "Movement below threshold"
    };
};


const analyzeDirection = (
    previousDistanceFromDestination,
    currentDistanceFromDestination
) => {

    if (
        previousDistanceFromDestination === null ||
        previousDistanceFromDestination === undefined
    ) {
        return {
            directionDetected: false,
            movingTowardDestination: false,
            reason: "No previous destination distance available"
        };
    }

    const distanceChange =
        previousDistanceFromDestination -
        currentDistanceFromDestination;

    const directionThreshold = 5;

    if (distanceChange >= directionThreshold) {
        return {
            directionDetected: true,
            movingTowardDestination: true,
            distanceChange,
            reason: "Moving toward destination"
        };
    }

    if (distanceChange <= -directionThreshold) {
        return {
            directionDetected: true,
            movingTowardDestination: false,
            distanceChange,
            reason: "Moving away from destination"
        };
    }

    return {
        directionDetected: false,
        movingTowardDestination: false,
        distanceChange,
        reason: "Direction change too small"
    };
};

module.exports = {
    analyzeLocation,
    analyzeMovement,
    analyzeDirection
};