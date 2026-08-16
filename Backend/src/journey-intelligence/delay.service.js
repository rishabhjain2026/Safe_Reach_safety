const DELAY_THRESHOLD_MINUTES = 10;

const analyzeDelay = ({
    expectedArrival,
    estimatedArrival
}) => {

    if (!estimatedArrival) {
        return {
            delayDetected: false,
            delayMinutes: 0,
            reason: "ETA unavailable"
        };
    }

    const expectedTime =
        new Date(expectedArrival).getTime();

    const estimatedTime =
        new Date(estimatedArrival).getTime();

    const delayMilliseconds =
        estimatedTime - expectedTime;

    const delayMinutes =
        Math.round(
            delayMilliseconds / 60000
        );

    if (delayMinutes >= DELAY_THRESHOLD_MINUTES) {
        return {
            delayDetected: true,
            delayMinutes,
            reason: "Journey is delayed"
        };
    }

    return {
        delayDetected: false,
        delayMinutes: Math.max(0, delayMinutes),
        reason: "Journey is on schedule"
    };
};

module.exports = {
    analyzeDelay
};