import api from "./api";


// Get all places of the logged-in user
export const getPlaces = async () => {

    const response = await api.get("/places");

    return response.data;
};


// Create a new place
export const createPlace = async (placeData) => {

    const response = await api.post(
        "/places",
        placeData
    );

    return response.data;
};