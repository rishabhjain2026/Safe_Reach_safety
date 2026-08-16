const REQUIRED_CONFIRMATIONS = 3;

const evaluateDeparture = ({movementDetected,movingTowardDestination,consecutiveConfirmations}) => {

    if (!movementDetected) {
        return {
            departureDetected: false,
            consecutiveConfirmations: 0,
            reason: "No movement detected"
        };
    }

    if (!movingTowardDestination) {
        return {
            departureDetected: false,
            consecutiveConfirmations: 0,
            reason: "User is not moving toward destination"
        };
    }

    const newConfirmationCount =
        consecutiveConfirmations + 1;

    if (newConfirmationCount >= REQUIRED_CONFIRMATIONS) {
        return {
            departureDetected: true,
            consecutiveConfirmations: newConfirmationCount,
            reason: "Departure confirmed"
        };
    }

    return {
        departureDetected: false,
        consecutiveConfirmations: newConfirmationCount,
        reason: "Waiting for more movement confirmations"
    };
};

module.exports = {
    evaluateDeparture
};