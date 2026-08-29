import api from "./api";


export const getJourneys = async () => {

    const response = await api.get("/journeys");

    return response.data;
};


export const getJourneyById = async (id) => {

    const response = await api.get(
        `/journeys/${id}`
    );

    return response.data;
};


export const createJourney = async (
    journeyData
) => {

    const response = await api.post(
        "/journeys",
        journeyData
    );

    return response.data;
};


export const updateJourney = async (
    id,
    journeyData
) => {

    const response = await api.put(
        `/journeys/${id}`,
        journeyData
    );

    return response.data;
};


export const cancelJourney = async (id) => {

    const response = await api.patch(
        `/journeys/${id}/cancel`
    );

    return response.data;
};





// Journeys.jsx
//       ↓
// journey.service.js
//       ↓
// api.js
//       ↓
// /api/journeys
//       ↓
// Journey backend