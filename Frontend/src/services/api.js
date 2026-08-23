import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

export default api;


// Instead of doing this everywhere:

// axios.get("http://localhost:5000/api/journeys");

// we'll later do:

// api.get("/journeys");

// So if your backend URL changes later, we only need to change it in one place.