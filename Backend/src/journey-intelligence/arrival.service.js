// This service will be responsible only for:

// "Has the user arrived?"

const ARRIVAL_RADIUS = 100;
const REQUIRED_CONFIRMATIONS = 3;

const evaluateArrival = ({
    distanceFromDestination,
    consecutiveConfirmations
}) => {

    if (distanceFromDestination > ARRIVAL_RADIUS) {
        return {
            arrivalDetected: false,
            consecutiveConfirmations: 0,
            reason: "User is outside arrival radius"
        };
    }

    const newConfirmationCount =
        consecutiveConfirmations + 1;

    if (newConfirmationCount >= REQUIRED_CONFIRMATIONS) {
        return {
            arrivalDetected: true,
            consecutiveConfirmations: newConfirmationCount,
            reason: "Arrival confirmed"
        };
    }

    return {
        arrivalDetected: false,
        consecutiveConfirmations: newConfirmationCount,
        reason: "User is near destination, waiting for confirmation"
    };
};

module.exports = {
    evaluateArrival
};