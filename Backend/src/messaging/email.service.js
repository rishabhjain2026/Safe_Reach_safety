// this code is for testing 

// const sendEmail = async ({
//     email,
//     subject,
//     message
// }) => {

//     console.log("================================");
//     console.log("MOCK EMAIL");
//     console.log("To:", email);
//     console.log("Subject:", subject);
//     console.log("Message:", message);
//     console.log("================================");

//     return {
//         success: true,
//         provider: "mock",
//         email,
//         subject,
//         message
//     };
// };

// module.exports = {
//     sendEmail
// };



// flow for email sender

// Location received
//       ↓
// Journey analysis
//       ↓
// Delay detected
//       ↓
// Notification Event Service
//       ↓
// Create Notification in DB
//       ↓
// Find Trusted Contacts
//       ↓
// Send Email
//       ↓
// Update Notification → SENT


// actual email sender code below

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


const sendEmail = async ({
    email,
    subject,
    message
}) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: subject,
        text: message
    };

    const info =
        await transporter.sendMail(mailOptions);

    return {
        success: true,
        messageId: info.messageId
    };
};


module.exports = {
    sendEmail
};