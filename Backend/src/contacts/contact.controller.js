const contactService = require("./contact.service");

const createContact = async (req, res) => {

    try {

        const contact = await contactService.createContact({
            userId: req.userId,
            name: req.body.name,
            phone: req.body.phone,
            relationship: req.body.relationship,
            priority: req.body.priority
        });

        res.status(201).json({
            success: true,
            message: "Trusted contact added successfully",
            data: contact
        });

    } catch (error) {
        console.error("Error adding trusted contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add trusted contact"
        });
    }
};

module.exports = {
    createContact
};