const sendSMS = async ({
    phone,
    message
}) => {

    console.log("================================");
    console.log("MOCK SMS");
    console.log("To:", phone);
    console.log("Message:", message);
    console.log("================================");

    return {
        success: true,
        provider: "mock",
        phone,
        message
    };
};

module.exports = {
    sendSMS
};