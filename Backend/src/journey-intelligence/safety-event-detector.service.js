const {createSafetyEvent} = require("./safety-event.service");

const {
    notifyTrustedContacts
} = require("../notifications/safety-notification.service");





// Location
//    ↓
// Safety Analyzer
//    ↓
// SAFE / WARNING / CRITICAL
//    ↓
// Compare with previous state
//    ↓
// State changed?
//    ↓
// YES
//    ↓
// Create SafetyEvent
//    ↓
// notifyTrustedContacts()
//    ↓
// createAndDeliverNotification()
//    ↓
// deliverNotification()
//    ↓
// Email






const detectSafetyStateChange = async ({
    journey,
    safetyAnalysis
}) => {

    const previousState =
        journey.safetyState;


    const currentState =
        safetyAnalysis.state;


    if (!previousState) {

        return {
            changed: false,
            event: null
        };
    }


    if (previousState === currentState) {

        return {
            changed: false,
            event: null
        };
    }


    let severity = "WARNING";

    if (currentState === "CRITICAL") {
        severity = "CRITICAL";
    }


    const event =
        await createSafetyEvent({

            journeyId: journey.id,

            type: "SAFETY_STATE_CHANGED",

            severity,

            message:
                `Journey safety changed from ${previousState} to ${currentState}`
        });

        await notifyTrustedContacts({
            journeyId: journey.id,

            userId: journey.userId,

            safetyEvent: event
        });


    return {
        changed: true,
        event
    };
};


module.exports = {
    detectSafetyStateChange
};