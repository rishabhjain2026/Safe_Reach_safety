const prisma = require("../config/prisma");

const createPlace = async ({
    userId,
    name,
    address,
    latitude,
    longitude
}) => {

    return await prisma.place.create({
        data: {
            userId,
            name,
            address,
            latitude: Number(latitude),
            longitude: Number(longitude)
        }
    });
};

const getPlaces = async (userId) => {

    return await prisma.place.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

module.exports = {
    createPlace,
    getPlaces
};