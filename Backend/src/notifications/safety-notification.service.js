const {
    createAndDeliverNotification
} = require("./notification-event.service");


const notifyTrustedContacts = async ({
    journeyId,
    userId,
    safetyEvent
}) => {

    const result =
        await createAndDeliverNotification({

            userId,

            journeyId,

            type: safetyEvent.type,

            message: safetyEvent.message
        });


    return result;
};


module.exports = {
    notifyTrustedContacts
};