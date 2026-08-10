const prisma = require("../config/prisma");

const createContact = async ({
    userId,
    name,
    phone,
    relationship,
    priority
}) => {

    const contact = await prisma.trustedContact.create({
        data: {
            userId,
            name,
            phone,
            relationship,
            priority: priority || 1
        }
    });

    return contact;
};

module.exports = {
    createContact
};