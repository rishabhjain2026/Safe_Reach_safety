import api from "./api";


export const sendLocation = async (
    journeyId,
    locationData
) => {

    const response = await api.post(
        "/tracking/location",
        {
            journeyId: Number(journeyId),
            ...locationData
        }
    );

    return response.data;
};