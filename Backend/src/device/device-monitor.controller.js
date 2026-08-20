const {
    checkUnreachableDevices
} = require("./device-monitor.service");


const testUnreachableDevices = async (req, res) => {

    try {

        const result =
            await checkUnreachableDevices();


        return res.status(200).json({
            success: true,
            message:
                "Device unreachable check completed",
            data: result
        });

    } catch (error) {

        console.error(
            "Device monitoring error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Failed to check device status"
        });
    }
};


module.exports = {
    testUnreachableDevices
};