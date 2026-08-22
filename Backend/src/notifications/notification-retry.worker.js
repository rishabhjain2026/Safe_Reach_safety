const cron = require("node-cron");

const {
    retryFailedNotifications
} = require("./notification-retry.service");







            //         SafeReach
            //            │
            //            ▼
            //     Location/Heartbeat
            //            │
            //            ▼
            //     Safety Analyzer
            //            │
            //            ▼
            //       Safety Event
            //            │
            //            ▼
            //       Notification
            //            │
            //            ▼
            //      Email Delivery
            //         /       \
            //        /         \
            //   SUCCESS       FAILURE
            //      ↓              ↓
            //    SENT          FAILED
            //                     │
            //                     ▼
            //              Retry Worker
            //                     │
            //            ┌────────┴────────┐
            //            ▼                 ▼
            //         SUCCESS           FAILURE
            //            ↓                 ↓
            //          SENT          retryCount++
            //                              │
            //                       retryCount >= 3
            //                              ↓
            //                           STOP























const startNotificationRetryWorker = () => {

    cron.schedule(
        "*/5 * * * *",
        async () => {

            console.log(
                "Running notification retry check..."
            );

            try {

                await retryFailedNotifications();

            } catch (error) {

                console.error(
                    "Notification retry error:",
                    error
                );
            }
        }
    );


    console.log(
        "Notification retry worker started"
    );
};


module.exports = {
    startNotificationRetryWorker
};