const prisma = require("../config/prisma");

const {analyzeLocation,analyzeMovement,analyzeDirection} = require("../journey-intelligence/journey-intelligence.service");

const {calculateDistance} = require("../journey-intelligence/geo.service");

const {evaluateDeparture} = require("../journey-intelligence/departure.service");

const {evaluateArrival} = require("../journey-intelligence/arrival.service");

const {calculateETA} = require("../journey-intelligence/eta.service");

const {analyzeDelay} = require("../journey-intelligence/delay.service");

// const {createNotification} = require("../notifications/notification.service");

const {createAndDeliverNotification} = require("../notifications/notification-event.service");

const {formatDateTime} = require("../utils/date.util");

const {
    analyzeJourneySafety
} = require("../journey-intelligence/safety.service");

const {detectSafetyStateChange} = require("../journey-intelligence/safety-event-detector.service");

const processLocation = async (userId, locationData) => {

    const journey = await prisma.journey.findFirst({
        where: {
            userId,
            status: {
                in: ["PLANNED", "ACTIVE"]
            }
        },
        orderBy: {
            plannedDeparture: "asc"
        },

        // orderBy: {
        // createdAt: "desc"
        // },
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

        await prisma.journey.update({
        where: {
            id: journey.id
        },

        data: {
            lastLocationAt: location.recordedAt
        }
    });

    

    const safetyAnalysis =await analyzeJourneySafety(journey.id);

    const safetyEvent =await detectSafetyStateChange({journey,safetyAnalysis});


//     Old state
//    ↓
// Analyze
//    ↓
// Compare
//    ↓
// Changed?
//    ├── NO → do nothing
//    │
//    └── YES
//         ↓
//     Create event
//         ↓
//     Update safetyState

    if (
    safetyAnalysis.state !== journey.safetyState) {

    await prisma.journey.update({
        where: {
            id: journey.id
        },

        data: {
            safetyState:
                safetyAnalysis.state
        }
    });
}

    const analysis = await analyzeLocation(
        journey.id,
        {
            latitude: location.latitude,
            longitude: location.longitude
        }
    );

    const movementAnalysis = analyzeMovement(previousLocation,location);

    console.log("journey_destination_latitude",journey.destination.latitude)


    let etaAnalysis = null;

    if (journey.status === "ACTIVE") {

        etaAnalysis = calculateETA({
            distanceRemaining:
                analysis.distanceFromDestination,

            currentSpeed:
                movementAnalysis.calculatedSpeed,

            currentTime:
                location.recordedAt
        });
    }


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

    let arrivalAnalysis = null;

    if (journey.status === "ACTIVE") {
        arrivalAnalysis = evaluateArrival({
            distanceFromDestination:
                analysis.distanceFromDestination,

            consecutiveConfirmations:
                journey.arrivalConfirmations
        });
    }

    const departureAnalysis =
    evaluateDeparture({
        movementDetected:
            movementAnalysis.movementDetected,

        movingTowardDestination:
            directionAnalysis.movingTowardDestination,

        consecutiveConfirmations:
            journey.departureConfirmations
    });


    let delayAnalysis = null;

    if (
        journey.status === "ACTIVE" &&
        etaAnalysis &&
        etaAnalysis.eta
    ) {

        delayAnalysis = analyzeDelay({
            expectedArrival:
                journey.expectedArrival,

            estimatedArrival:
                etaAnalysis.eta
        });
    }


    //notification to send if the delay is detected but it will send the notification in every 10 second that we dont as it will send many messaga to the family menber and thus increase the cost to prevent that we will make sure thenotificatiob is only send if previously messgae isi not sent 
//     if (
//     delayAnalysis &&
//     delayAnalysis.delayDetected
// ) {
//     await createNotification({
//         userId: journey.userId,
//         journeyId: journey.id,
//         type: "DELAY_DETECTED",
//         channel: "SMS",
//         message: `Your journey is delayed by approximately ${delayAnalysis.delayMinutes} minutes.`
//     });
// }


//     if (
//         delayAnalysis &&
//         delayAnalysis.delayDetected
//     ) {
//     const existingNotification =
//         await prisma.notification.findFirst({
//             where: {
//                 journeyId: journey.id,
//                 type: "DELAY_DETECTED"
//             }
//         });

//     if (!existingNotification) {

//         await createNotification({
//             userId: journey.userId,
//             journeyId: journey.id,
//             type: "DELAY_DETECTED",
//             channel: "SMS",
//             message: `Your journey is delayed by approximately ${delayAnalysis.delayMinutes} minutes.`
//         });
//     }
// }


    if (
        delayAnalysis &&
        delayAnalysis.delayDetected
    ) {
    const existingNotification =
        await prisma.notification.findFirst({
            where: {
                journeyId: journey.id,
                type: "DELAY_DETECTED"
            }
        });
    if (!existingNotification) {
        const message = `
            SafeReach — Journey Delay Alert

            Your journey from ${journey.origin.name} to ${journey.destination.name} is running late.

            Expected arrival:
            ${formatDateTime(journey.expectedArrival)}

            Estimated arrival:
            ${formatDateTime(etaAnalysis.eta)}

            Delay:
            ${delayAnalysis.delayMinutes} minutes

            SafeReach is continuing to monitor the journey and will notify you when the journey is completed.
            `;
        await createAndDeliverNotification({
            userId: journey.userId,
            journeyId: journey.id,
            type: "DELAY_DETECTED",
            message
        });
    }
}



    let updatedJourney = journey;

    if (departureAnalysis.departureDetected) {

        updatedJourney =
            await prisma.journey.update({
                where: {
                    id: journey.id
                },
                data: {
                    status: "ACTIVE",

                    actualDeparture:
                        location.recordedAt,

                    departureConfirmations:
                        departureAnalysis.consecutiveConfirmations
                }
            });

    } else {

        updatedJourney =
            await prisma.journey.update({
                where: {
                    id: journey.id
                },
                data: {
                    departureConfirmations:departureAnalysis.consecutiveConfirmations
                }
            });
    }


// if (arrivalAnalysis) {

//     if (arrivalAnalysis.arrivalDetected) {

//         updatedJourney =
//             await prisma.journey.update({
//                 where: {
//                     id: journey.id
//                 },

//                 data: {
//                     status: "COMPLETED",

//                     actualArrival:
//                         location.recordedAt,

//                     arrivalConfirmations:
//                         arrivalAnalysis.consecutiveConfirmations
//                 }
//             });

//     } else {

//         updatedJourney =
//             await prisma.journey.update({
//                 where: {
//                     id: journey.id
//                 },

//                 data: {
//                     arrivalConfirmations:
//                         arrivalAnalysis.consecutiveConfirmations
//                 }
//             });
//     }
// }





// Destination reached
//        ↓
// Arrival detected
//        ↓
// Journey → COMPLETED
//        ↓
// 📧 Arrival email to trusted contacts

if (arrivalAnalysis) {

    if (arrivalAnalysis.arrivalDetected) {

        updatedJourney =
            await prisma.journey.update({
                where: {
                    id: journey.id
                },

                data: {
                    status: "COMPLETED",

                    actualArrival:
                        location.recordedAt,

                    arrivalConfirmations:
                        arrivalAnalysis.consecutiveConfirmations
                }
            });


        // Check whether arrival notification
        // has already been sent
        const existingArrivalNotification =
            await prisma.notification.findFirst({
                where: {
                    journeyId: journey.id,
                    type: "ARRIVAL_DETECTED"
                }
            });


        if (!existingArrivalNotification) {

            const message = `
                SafeReach — Journey Completed

                The journey from ${journey.origin.name} to ${journey.destination.name} has been completed successfully.

                Arrival time:
                ${formatDateTime(location.recordedAt)}

                The traveler has safely reached the destination.

                — SafeReach
                `;


            await createAndDeliverNotification({
                userId: journey.userId,
                journeyId: journey.id,
                type: "ARRIVAL_DETECTED",
                message
            });
        }


    } else {

        updatedJourney =
            await prisma.journey.update({
                where: {
                    id: journey.id
                },

                data: {
                    arrivalConfirmations:
                        arrivalAnalysis.consecutiveConfirmations
                }
            });
    }
}

    return {
        journey:updatedJourney,
        location,
        analysis,
        movementAnalysis,
        directionAnalysis,
        departureAnalysis,
        arrivalAnalysis,
        etaAnalysis,
        delayAnalysis,
        safetyAnalysis,
        safetyEvent
    };
};

module.exports = {
    processLocation
};