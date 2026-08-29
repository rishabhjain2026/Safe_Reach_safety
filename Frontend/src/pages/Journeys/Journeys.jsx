import {
    useEffect,
    useState
} from "react";

import {
    Map,
    Plus,
    Pencil,
    X,
    Clock,
    MapPin
} from "lucide-react";

import {
    getJourneys,
    createJourney,
    updateJourney,
    cancelJourney
} from "../../services/journey.service";

import {
    getPlaces
} from "../../services/place.service";


const Journeys = () => {

    const [journeys, setJourneys] =
        useState([]);

    const [places, setPlaces] =
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
            originId: "",
            destinationId: "",
            plannedDeparture: "",
            expectedDuration: ""
        });


    // Fetch journeys

    const fetchJourneys = async () => {

        try {

            const response =
                await getJourneys();

            setJourneys(
                response.data || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch journeys"
            );

        }

    };


    // Fetch places

    const fetchPlaces = async () => {

        try {

            const response =
                await getPlaces();

            setPlaces(
                response.data || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch places"
            );

        }

    };


    // Initial page load

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchJourneys(),
                fetchPlaces()
            ]);

            setLoading(false);

        };

        loadData();

    }, []);


    const resetForm = () => {

        setFormData({
            originId: "",
            destinationId: "",
            plannedDeparture: "",
            expectedDuration: ""
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
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (
            formData.originId ===
            formData.destinationId
        ) {

            setError(
                "Origin and destination cannot be the same"
            );

            return;

        }


        const journeyData = {

            originId:
                Number(formData.originId),

            destinationId:
                Number(formData.destinationId),

            plannedDeparture:
                new Date(
                    formData.plannedDeparture
                ).toISOString(),

            expectedDuration:
                Number(
                    formData.expectedDuration
                )

        };


        try {

            if (editingId) {

                await updateJourney(
                    editingId,
                    journeyData
                );

            } else {

                await createJourney(
                    journeyData
                );

            }


            resetForm();

            await fetchJourneys();


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to save journey"
            );

        }

    };


    const handleEdit = (journey) => {

        setEditingId(
            journey.id
        );


        const departureDate =
            new Date(
                journey.plannedDeparture
            );


        // Format date for datetime-local input

        const formattedDate =
            departureDate
                .toISOString()
                .slice(0, 16);


        setFormData({

            originId:
                String(journey.originId),

            destinationId:
                String(journey.destinationId),

            plannedDeparture:
                formattedDate,

            expectedDuration:
                String(
                    journey.expectedDuration
                )

        });


        setShowForm(true);

    };


    const handleCancel = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this journey?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await cancelJourney(id);

            await fetchJourneys();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to cancel journey"
            );

        }

    };


    const formatDate = (date) => {

        return new Date(
            date
        ).toLocaleString();

    };


    return (

        <div className="journeys-page">


            {/* Header */}

            <div className="page-header">

                <div>

                    <h1>
                        My Journeys
                    </h1>

                    <p>
                        Plan and manage your upcoming journeys.
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

                    Create Journey

                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* Create / Edit Form */}

            {showForm && (

                <div className="journey-form-card">

                    <h2>

                        {editingId
                            ? "Edit Journey"
                            : "Create Journey"
                        }

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* Origin */}

                        <div className="form-group">

                            <label>
                                Origin
                            </label>

                            <select
                                name="originId"
                                value={
                                    formData.originId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select origin
                                </option>


                                {places.map(
                                    (place) => (

                                        <option
                                            key={place.id}
                                            value={place.id}
                                        >

                                            {place.name}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Destination */}

                        <div className="form-group">

                            <label>
                                Destination
                            </label>

                            <select
                                name="destinationId"
                                value={
                                    formData.destinationId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select destination
                                </option>


                                {places.map(
                                    (place) => (

                                        <option
                                            key={place.id}
                                            value={place.id}
                                        >

                                            {place.name}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Departure */}

                        <div className="form-group">

                            <label>
                                Planned Departure
                            </label>

                            <input
                                type="datetime-local"
                                name="plannedDeparture"
                                value={
                                    formData.plannedDeparture
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* Duration */}

                        <div className="form-group">

                            <label>
                                Expected Duration (minutes)
                            </label>

                            <input
                                type="number"
                                name="expectedDuration"
                                placeholder="Example: 60"
                                min="1"
                                value={
                                    formData.expectedDuration
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* Buttons */}

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
                                    ? "Update Journey"
                                    : "Create Journey"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* Loading */}

            {loading ? (

                <p>
                    Loading journeys...
                </p>

            ) : journeys.length === 0 ? (

                <div className="empty-state">

                    <Map size={42} />

                    <h3>
                        No journeys yet
                    </h3>

                    <p>
                        Create your first journey to start using SafeReach.
                    </p>

                </div>

            ) : (

                <div className="journeys-grid">


                    {journeys.map(
                        (journey) => (

                            <div
                                className="journey-card"
                                key={journey.id}
                            >


                                {/* Status */}

                                <div className="journey-card-top">

                                    <span
                                        className={`journey-status ${journey.status.toLowerCase()}`}
                                    >

                                        {journey.status}

                                    </span>


                                    <span className="journey-id">

                                        Journey #{journey.id}

                                    </span>

                                </div>


                                {/* Route */}

                                <div className="journey-route">

                                    <div>

                                        <MapPin
                                            size={18}
                                        />

                                        <span>

                                            {
                                                journey.origin?.name
                                            }

                                        </span>

                                    </div>


                                    <div className="route-line">

                                        →

                                    </div>


                                    <div>

                                        <MapPin
                                            size={18}
                                        />

                                        <span>

                                            {
                                                journey.destination?.name
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* Details */}

                                <div className="journey-details">

                                    <div>

                                        <Clock
                                            size={16}
                                        />

                                        <span>

                                            {
                                                formatDate(
                                                    journey.plannedDeparture
                                                )
                                            }

                                        </span>

                                    </div>


                                    <div>

                                        Duration:{" "}

                                        {
                                            journey.expectedDuration
                                        }

                                        {" "}minutes

                                    </div>

                                </div>


                                {/* Actions */}

                                {journey.status ===
                                    "PLANNED" && (

                                    <div className="journey-actions">


                                        <button
                                            className="secondary-button small-button"
                                            onClick={() =>
                                                handleEdit(
                                                    journey
                                                )
                                            }
                                        >

                                            <Pencil
                                                size={16}
                                            />

                                            Edit

                                        </button>


                                        <button
                                            className="danger-button small-button"
                                            onClick={() =>
                                                handleCancel(
                                                    journey.id
                                                )
                                            }
                                        >

                                            <X
                                                size={16}
                                            />

                                            Cancel

                                        </button>

                                    </div>

                                )}

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

};


export default Journeys;