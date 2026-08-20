const {
    checkMissedArrivals
} = require("./missed-arrival.service");


const testMissedArrivals = async (req, res) => {

    try {

        await checkMissedArrivals();

        return res.status(200).json({
            success: true,
            message:
                "Missed arrival check completed"
        });

    } catch (error) {

        console.error(
            "Missed arrival check error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to check missed arrivals"
        });
    }
};


module.exports = {
    testMissedArrivals
};