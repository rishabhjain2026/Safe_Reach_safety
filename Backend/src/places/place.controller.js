const placeService = require("./place.service");

const createPlace = async (req, res) => {

    try {

        const place = await placeService.createPlace({
            userId: req.userId,
            name: req.body.name,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        console.log("Place created:", place);

        res.status(201).json({
            success: true,
            message: "Place created successfully",
            data: place
        });

    } catch (error) {

        console.error("Create place error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create place"
        });
    }
};

const getPlaces = async (req, res) => {

    try {

        const places = await placeService.getPlaces(
            req.userId
        );
        console.log("Place",places)

        res.status(200).json({
            success: true,
            data: places
        });

    } catch (error) {

        console.error("Get places error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch places"
        });
    }
};

module.exports = {
    createPlace,
    getPlaces
};