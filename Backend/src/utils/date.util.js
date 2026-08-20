const formatDateTime = (date) => {

    if (!date) {
        return "Not available";
    }

    return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
    });
};

module.exports = {
    formatDateTime
};