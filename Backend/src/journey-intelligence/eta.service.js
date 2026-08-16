// ETA means:

// Estimated Time of Arrival

// Suppose:

// Current location
//        ↓
// 5 km from hostel


// Current speed
//        ↓
// 30 km/hour

// Then:

// Time remaining
// = Distance / Speed


// = 5 / 30 hours
// = 10 minutes

// So if it's currently:

// 6:20 PM

// we estimate:

// ETA = 6:30 PM




const calculateETA = ({
    distanceRemaining,
    currentSpeed,
    currentTime
}) => {

    if (distanceRemaining <= 0) {
        return {
            eta: new Date(currentTime),
            remainingMinutes: 0,
            reason: "Already at destination"
        };
    }

    if (!currentSpeed || currentSpeed <= 0) {
        return {
            eta: null,
            remainingMinutes: null,
            reason: "Unable to calculate ETA because user is not moving"
        };
    }

    // distanceRemaining is in meters
    // currentSpeed is in meters per second

    const remainingSeconds =
        distanceRemaining / currentSpeed;

    const eta =
        new Date(
            new Date(currentTime).getTime() +
            remainingSeconds * 1000
        );

    return {
        eta,
        remainingMinutes:
            Math.round(remainingSeconds / 60),
        reason: "ETA calculated successfully"
    };
};

module.exports = {
    calculateETA
};