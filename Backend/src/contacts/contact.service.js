const prisma = require("../config/prisma");

const createContact = async ({
    userId,
    name,
    phone,
    email,
    relationship,
    priority
}) => {

    const contact = await prisma.trustedContact.create({
        data: {
            userId,
            name,
            phone,
            email,
            relationship,
            priority: priority || 1
        }
    });

    console.log("contact",contact)

    return contact;
};




const getContacts = async (userId) => {
    return await prisma.trustedContact.findMany({
        where: {
            userId
        },
        orderBy: {
            priority: "asc"
        }
    });
};


const getContactById = async (userId, contactId) => {

    return await prisma.trustedContact.findFirst({
        where: {
            id: contactId,
            userId
        }
    });
};


const updateContact=async (userId, contactId, updateData) => {
    return await prisma.trustedContact.updateMany({
        where: {
            id: contactId,
            userId
        },
        data: updateData
    });
};

const deleteContact = async (
    userId,
    contactId
) => {

    const existingContact =
        await prisma.trustedContact.findFirst({
            where: {
                id: contactId,
                userId
            }
        });

    if (!existingContact) {
        return null;
    }

    return await prisma.trustedContact.update({
        where: {
            id: contactId
        },
        data: {
            isActive: false
        }
    });
};

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
};