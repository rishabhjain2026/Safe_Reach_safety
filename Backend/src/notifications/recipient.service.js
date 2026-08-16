const prisma = require("../config/prisma");

const getNotificationRecipients = async (userId) => {

    const contacts = await prisma.trustedContact.findMany({
        where: {
            userId: userId,
            isActive: true
        },
        orderBy: {
            priority: "asc"
        }
    });

    return contacts;
};

module.exports = {
    getNotificationRecipients
};