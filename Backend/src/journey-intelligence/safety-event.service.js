const prisma = require("../config/prisma");


const createSafetyEvent = async ({
    journeyId,
    type,
    severity,
    message
}) => {

    return await prisma.safetyEvent.create({
        data: {
            journeyId,
            type,
            severity,
            message
        }
    });
};


const getJourneySafetyEvents = async (journeyId) => {

    return await prisma.safetyEvent.findMany({
        where: {
            journeyId
        },

        orderBy: {
            createdAt: "desc"
        }
    });
};


module.exports = {
    createSafetyEvent,
    getJourneySafetyEvents
};