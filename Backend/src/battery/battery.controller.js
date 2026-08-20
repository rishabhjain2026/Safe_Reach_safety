const {processBattery} = require("./battery.service");

const receiveBattery = async (req, res) => {

    try {

        const {
            journeyId,
            batteryPercentage
        } = req.body;


        if (!journeyId) {

            return res.status(400).json({
                success: false,
                message: "journeyId is required"
            });
        }


        if (batteryPercentage === undefined) {

            return res.status(400).json({
                success: false,
                message:
                    "batteryPercentage is required"
            });
        }


        const result =
            await processBattery(
                Number(journeyId),
                batteryPercentage
            );


        return res.status(200).json({
            success: true,
            message:
                "Battery information received successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Battery processing error:",
            error
        );


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    receiveBattery
};