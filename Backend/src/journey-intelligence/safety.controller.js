const {analyzeJourneySafety} = require("./safety.service");


const getJourneySafety = async (req, res) => {

    try {

        const journeyId =
            Number(req.params.journeyId);


        if (!journeyId) {

            return res.status(400).json({
                success: false,
                message: "Invalid journeyId"
            });
        }


        const result =
            await analyzeJourneySafety(
                journeyId
            );


        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Safety analysis error:",
            error
        );


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getJourneySafety
};