// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:5000/api"
// });

// export default api;


// Instead of doing this everywhere:

// axios.get("http://localhost:5000/api/journeys");

// we'll later do:

// api.get("/journeys");

// So if your backend URL changes later, we only need to change it in one place.








// We're going to eventually make it automatically attach the authentication token.



import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});


api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


export default api;



// What is this code doing?

// Normally, when you make a request:

// api.get("/places");

// Axios would send:

// GET /api/places

// But your backend requires:

// Authorization: Bearer <token>

// The Axios interceptor automatically runs before every request.

// Flow
// React requests Places
//         ↓
// api.get("/places")
//         ↓
// Axios interceptor runs
//         ↓
// Get token from localStorage
//         ↓
// Add Authorization header
//         ↓
// Send request to backend
//         ↓
// authenticate middleware
//         ↓
// req.userId

// This means we don't need to manually write:

// Authorization: `Bearer ${token}`

// in every service file.

// That is why this approach is cleaner.