const {
    checkUnreachableDevices
} = require("../device/device-monitor.service");


const startDeviceMonitorScheduler = () => {

    console.log(
        "Device monitor scheduler started"
    );


    // Run the first check after the server starts
    checkUnreachableDevices()
        .catch(error => {
            console.error(
                "Initial device monitor check failed:",
                error
            );
        });


    // Run every 1 minute
    setInterval(async () => {

        try {

            console.log(
                "Running device unreachable check..."
            );

            const result =
                await checkUnreachableDevices();


            console.log(
                "Device monitor result:",
                result
            );

        } catch (error) {

            console.error(
                "Device monitor scheduler error:",
                error
            );
        }

    }, 60 * 1000);
};


module.exports = {
    startDeviceMonitorScheduler
};