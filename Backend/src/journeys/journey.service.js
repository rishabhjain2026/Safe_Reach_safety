const prisma = require("../config/prisma");

const createJourney = async ({
    userId,
    originId,
    destinationId,
    plannedDeparture,
    expectedDuration
}) => {

    // Check that the origin belongs to the logged-in user
    const origin = await prisma.place.findFirst({
        where: {
            id: originId,
            userId
        }
    });

    if (!origin) {
        throw new Error("Origin place not found");
    }

    // Check that the destination belongs to the logged-in user
    const destination = await prisma.place.findFirst({
        where: {
            id: destinationId,
            userId
        }
    });

    if (!destination) {
        throw new Error("Destination place not found");
    }

    // Prevent using the same place as both origin and destination
    if (originId === destinationId) {
        throw new Error(
            "Origin and destination cannot be the same"
        );
    }

    // Convert the planned departure into a JavaScript Date
    const departureDate = new Date(plannedDeparture);

    // Calculate expected arrival
    const expectedArrival = new Date(
        departureDate.getTime() +
        expectedDuration * 60 * 1000
    );

    // Create the journey
    const journey = await prisma.journey.create({
        data: {
            userId,
            originId,
            destinationId,
            plannedDeparture: departureDate,
            expectedDuration,
            expectedArrival
        },
        include: {
            origin: true,
            destination: true
        }
    });

    return journey;
};

const getJourneys = async (userId) => {

    const journeys = await prisma.journey.findMany({
        where: {
            userId
        },
        include: {
            origin: true,
            destination: true
        },
        orderBy: {
            plannedDeparture: "desc"
        }
    });

    return journeys;
};



const getJourneyById = async (journeyId, userId) => {

    const journey = await prisma.journey.findFirst({
        where: {
            id: journeyId,
            userId
        },
        include: {
            origin: true,
            destination: true
        }
    });

    if (!journey) {
        throw new Error("Journey not found");
    }

    return journey;
};

const updateJourney = async (
    journeyId,
    userId,
    updateData
) => {

    const journey = await prisma.journey.findFirst({
        where: {
            id: journeyId,
            userId
        }
    });

    if (!journey) {
        throw new Error("Journey not found");
    }

    if (journey.status !== "PLANNED") {
        throw new Error(
            "Only planned journeys can be updated"
        );
    }

    const originId =
        updateData.originId ?? journey.originId;

    const destinationId =
        updateData.destinationId ?? journey.destinationId;

    if (originId === destinationId) {
        throw new Error(
            "Origin and destination cannot be the same"
        );
    }

    if (updateData.originId !== undefined) {

        const origin = await prisma.place.findFirst({
            where: {
                id: updateData.originId,
                userId
            }
        });

        if (!origin) {
            throw new Error("Origin place not found");
        }
    }

    if (updateData.destinationId !== undefined) {

        const destination = await prisma.place.findFirst({
            where: {
                id: updateData.destinationId,
                userId
            }
        });

        if (!destination) {
            throw new Error(
                "Destination place not found"
            );
        }
    }

    const plannedDeparture =
        updateData.plannedDeparture
            ? new Date(updateData.plannedDeparture)
            : journey.plannedDeparture;

    const expectedDuration =
        updateData.expectedDuration ??
        journey.expectedDuration;

    const expectedArrival = new Date(
        plannedDeparture.getTime() +
        expectedDuration * 60 * 1000
    );

    const updatedJourney = await prisma.journey.update({
        where: {
            id: journeyId
        },
        data: {
            originId,
            destinationId,
            plannedDeparture,
            expectedDuration,
            expectedArrival
        },
        include: {
            origin: true,
            destination: true
        }
    });

    return updatedJourney;
};

const cancelJourney = async (journeyId, userId) => {

    const journey = await prisma.journey.findFirst({
        where: {
            id: journeyId,
            userId
        }
    });

    if (!journey) {
        throw new Error("Journey not found");
    }

    if (journey.status !== "PLANNED") {
        throw new Error(
            "Only planned journeys can be cancelled"
        );
    }

    const cancelledJourney = await prisma.journey.update({
        where: {
            id: journeyId
        },
        data: {
            status: "CANCELLED"
        },
        include: {
            origin: true,
            destination: true
        }
    });

    return cancelledJourney;
};
module.exports = {
    createJourney,
    getJourneys,
    getJourneyById,
    updateJourney,
    cancelJourney
};