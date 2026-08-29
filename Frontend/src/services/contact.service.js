import api from "./api";


export const getContacts = async () => {

    const response = await api.get("/contacts");

    return response.data;
};


export const getContactById = async (id) => {

    const response = await api.get(
        `/contacts/${id}`
    );

    return response.data;
};


export const createContact = async (contactData) => {

    const response = await api.post(
        "/contacts",
        contactData
    );

    return response.data;
};


export const updateContact = async (
    id,
    contactData
) => {

    const response = await api.put(
        `/contacts/${id}`,
        contactData
    );

    return response.data;
};


export const deleteContact = async (id) => {

    const response = await api.delete(
        `/contacts/${id}`
    );

    return response.data;
};