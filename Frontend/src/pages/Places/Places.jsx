import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";

import {
    getPlaces,
    createPlace
} from "../../services/place.service";


const Places = () => {

    const [places, setPlaces] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        latitude: "",
        longitude: ""
    });

    const [error, setError] = useState("");


    const fetchPlaces = async () => {

        try {

            setLoading(true);

            const response =
                await getPlaces();

            setPlaces(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch places"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchPlaces();

    }, []);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        try {

            await createPlace({
                name: formData.name,
                address: formData.address,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude)
            });


            setFormData({
                name: "",
                address: "",
                latitude: "",
                longitude: ""
            });


            setShowForm(false);


            await fetchPlaces();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create place"
            );

        }

    };


    return (

        <div className="places-page">

            <div className="page-header">

                <div>
                    <h1>Places</h1>

                    <p>
                        Manage locations you frequently use for journeys.
                    </p>
                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        setShowForm(true)
                    }
                >
                    <Plus size={18} />
                    Add Place
                </button>

            </div>


            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {showForm && (

                <div className="place-form-card">

                    <h2>Add New Place</h2>


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>
                                Place Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Example: Hostel"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                placeholder="Enter address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="coordinates-grid">

                            <div className="form-group">

                                <label>
                                    Latitude
                                </label>

                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    placeholder="23.2220"
                                    value={
                                        formData.latitude
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Longitude
                                </label>

                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    placeholder="77.4391"
                                    value={
                                        formData.longitude
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Save Place
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {loading ? (

                <p>Loading places...</p>

            ) : places.length === 0 ? (

                <div className="empty-state">

                    <MapPin size={40} />

                    <h3>
                        No places added yet
                    </h3>

                    <p>
                        Add places like Home, Office,
                        Hostel, or College.
                    </p>

                </div>

            ) : (

                <div className="places-grid">

                    {places.map((place) => (

                        <div
                            className="place-card"
                            key={place.id}
                        >

                            <div className="place-icon">
                                <MapPin size={22} />
                            </div>


                            <div>

                                <h3>
                                    {place.name}
                                </h3>

                                <p>
                                    {place.address}
                                </p>

                                <span>
                                    {place.latitude},
                                    {" "}
                                    {place.longitude}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};


export default Places;









// What this page is doing

// When the page opens:

// Places.jsx
//    ↓
// useEffect()
//    ↓
// getPlaces()
//    ↓
// GET /api/places
//    ↓
// JWT automatically attached by api.js
//    ↓
// Backend authenticate()
//    ↓
// req.userId
//    ↓
// Database
//    ↓
// setPlaces()
//    ↓
// Display cards

// When the user adds a place:

// Form
//  ↓
// handleSubmit()
//  ↓
// createPlace()
//  ↓
// POST /api/places
//  ↓
// Database
//  ↓
// fetchPlaces()
//  ↓
// Updated list

// So this is our first real frontend ↔ backend integration.