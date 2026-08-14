const trackingService = require("./tracking.service");

const receiveLocation = async (req, res) => {

    try {

        const location = await trackingService.processLocation(
            req.userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Location received successfully",
            data: location
        });

    } catch (error) {

        console.error("Location processing error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process location"
        });
    }
};

module.exports = {
    receiveLocation
};