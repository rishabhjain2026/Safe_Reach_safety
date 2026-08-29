import {
    useEffect,
    useState
} from "react";

import {
    Users,
    Plus,
    Pencil,
    Trash2,
    Mail,
    Phone
} from "lucide-react";

import {
    getContacts,
    createContact,
    updateContact,
    deleteContact
} from "../../services/contact.service";


const Contacts = () => {

    const [contacts, setContacts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);


    const [formData, setFormData] =
        useState({
            name: "",
            phone: "",
            email: "",
            relationship: "",
            priority: 1,
            isActive: true
        });


    const fetchContacts = async () => {

        try {

            setLoading(true);

            const response =
                await getContacts();

            setContacts(
                response.data || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch contacts"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchContacts();

    }, []);


    const resetForm = () => {

        setFormData({
            name: "",
            phone: "",
            email: "",
            relationship: "",
            priority: 1,
            isActive: true
        });

        setEditingId(null);

        setShowForm(false);
    };


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "priority"
                    ? Number(value)
                    : value
        }));
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        try {

            if (editingId) {

                await updateContact(
                    editingId,
                    formData
                );

            } else {

                await createContact(
                    formData
                );
            }


            resetForm();

            await fetchContacts();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to save contact"
            );
        }
    };


    const handleEdit = (contact) => {

        setEditingId(contact.id);

        setFormData({
            name: contact.name || "",
            phone: contact.phone || "",
            email: contact.email || "",
            relationship:
                contact.relationship || "",
            priority:
                contact.priority || 1,
            isActive:
                contact.isActive ?? true
        });

        setShowForm(true);
    };


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this trusted contact?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await deleteContact(id);

            await fetchContacts();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete contact"
            );
        }
    };


    return (

        <div className="contacts-page">

            <div className="page-header">

                <div>

                    <h1>
                        Trusted Contacts
                    </h1>

                    <p>
                        People SafeReach can notify during your journey.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() => {

                        resetForm();

                        setShowForm(true);
                    }}
                >
                    <Plus size={18} />

                    Add Contact
                </button>

            </div>


            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {showForm && (

                <div className="contact-form-card">

                    <h2>
                        {editingId
                            ? "Edit Contact"
                            : "Add Trusted Contact"
                        }
                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="contact-form-grid">

                            <div className="form-group">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Example: Mother"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Relationship
                                </label>

                                <input
                                    type="text"
                                    name="relationship"
                                    placeholder="Mother, Father, Friend..."
                                    value={
                                        formData.relationship
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+91..."
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="contact@example.com"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={
                                        formData.priority
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value={1}>
                                        Priority 1
                                    </option>

                                    <option value={2}>
                                        Priority 2
                                    </option>

                                    <option value={3}>
                                        Priority 3
                                    </option>
                                </select>

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-button"
                            >
                                {editingId
                                    ? "Update Contact"
                                    : "Save Contact"
                                }
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {loading ? (

                <p>
                    Loading contacts...
                </p>

            ) : contacts.length === 0 ? (

                <div className="empty-state">

                    <Users size={40} />

                    <h3>
                        No trusted contacts yet
                    </h3>

                    <p>
                        Add someone who should receive SafeReach safety alerts.
                    </p>

                </div>

            ) : (

                <div className="contacts-grid">

                    {contacts.map(
                        (contact) => (

                            <div
                                className="contact-card"
                                key={contact.id}
                            >

                                <div className="contact-card-header">

                                    <div>

                                        <h3>
                                            {contact.name}
                                        </h3>

                                        <span>
                                            {contact.relationship ||
                                                "Trusted Contact"}
                                        </span>

                                    </div>


                                    <div
                                        className={
                                            contact.isActive
                                                ? "contact-status active"
                                                : "contact-status inactive"
                                        }
                                    >
                                        {contact.isActive
                                            ? "Active"
                                            : "Inactive"
                                        }
                                    </div>

                                </div>


                                <div className="contact-details">

                                    <div>
                                        <Phone size={16} />
                                        {contact.phone}
                                    </div>

                                    <div>
                                        <Mail size={16} />
                                        {contact.email ||
                                            "No email"}
                                    </div>

                                </div>


                                <div className="contact-card-footer">

                                    <span>
                                        Priority{" "}
                                        {contact.priority}
                                    </span>


                                    <div>

                                        <button
                                            className="icon-action-button"
                                            onClick={() =>
                                                handleEdit(
                                                    contact
                                                )
                                            }
                                        >
                                            <Pencil
                                                size={17}
                                            />
                                        </button>


                                        <button
                                            className="icon-action-button danger"
                                            onClick={() =>
                                                handleDelete(
                                                    contact.id
                                                )
                                            }
                                        >
                                            <Trash2
                                                size={17}
                                            />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );
};


export default Contacts;