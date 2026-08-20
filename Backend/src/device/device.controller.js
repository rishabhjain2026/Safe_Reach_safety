const {
    processHeartbeat
} = require("./device.service");


const receiveHeartbeat = async (req, res) => {

    try {

        const {
            journeyId
        } = req.body;


        if (!journeyId) {

            return res.status(400).json({
                success: false,
                message: "journeyId is required"
            });
        }


        const result =
            await processHeartbeat(
                Number(journeyId)
            );


        return res.status(200).json({
            success: true,
            message: "Heartbeat received successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Heartbeat processing error:",
            error
        );


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    receiveHeartbeat
};