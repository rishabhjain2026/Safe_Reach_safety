const {
    getNotificationRecipients
} = require("../notifications/recipient.service");

const {
    sendSMS
} = require("./sms.service");

const {
    sendEmail
} = require("./email.service");


// notification for sms sending

// const deliverNotification = async ({
//     userId,
//     message
// }) => {

//     const recipients =
//         await getNotificationRecipients(userId);

//     const results = [];

//     for (const recipient of recipients) {

//         const result = await sendSMS({
//             phone: recipient.phone,
//             message
//         });

//         results.push({
//             recipientId: recipient.id,
//             name: recipient.name,
//             phone: recipient.phone,
//             result
//         });
//     }

//     return results;
// };





// notification for email sending

const deliverNotification = async ({
    userId,
    subject,
    message
}) => {

    const recipients =
        await getNotificationRecipients(userId);

    const results = [];

    for (const recipient of recipients) {

        if (!recipient.email) {
            continue;
        }

        const result = await sendEmail({
            email: recipient.email,
            subject,
            message
        });

        results.push({
            recipientId: recipient.id,
            name: recipient.name,
            email: recipient.email,
            result
        });
    }

    return results;
};

module.exports = {
    deliverNotification
};