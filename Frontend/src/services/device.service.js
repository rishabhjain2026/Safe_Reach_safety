import api from "./api";


export const sendHeartbeat = async (
    journeyId
) => {

    const response = await api.post(
        "/device/heartbeat",
        {
            journeyId:
                Number(journeyId)
        }
    );

    return response.data;
};