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


const getContacts = async (req, res) => {

    try {
        const contacts = await contactService.getContacts(
            req.userId
        );

        res.status(200).json({
            success: true,
            data: contacts
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch trusted contacts"
        });
    }
};

const getcontactbyid=async(req,res)=>{
    try {
        const contactId = Number(req.params.id);

        if (isNaN(contactId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        const contact = await contactService.getContactById(
            req.userId,
            contactId
        );

        if(!contact){
            return res.status(404).json({
                success: false,
                message: "Contact not found contact for this user"
            });
        }
       
        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch trusted contacts"
        });
    }
}

const updateContact=async(req,res)=>{
    try {
        const contactId = Number(req.params.id);

        if (isNaN(contactId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        const contact = await contactService.getContactById(
            req.userId,
            contactId
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        const updatedContact = await contactService.updateContact(
            req.userId,
            contactId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: updatedContact
        });
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update contact"
        });
    }
}

const deleteContact = async (req, res) => {

    try {

        const contactId = Number(req.params.id);

        if (Number.isNaN(contactId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }

        const contact = await contactService.deleteContact(
            req.userId,
            contactId
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact removed successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to remove contact"
        });
    }
};

module.exports = {
    createContact,
    getContacts,
    getcontactbyid,
    updateContact,
    deleteContact
};