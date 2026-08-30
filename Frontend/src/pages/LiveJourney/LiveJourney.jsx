import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Navigation,
    MapPin,
    Battery,
    Clock,
    Radio
} from "lucide-react";

import { sendLocation } from "../../services/tracking.service";

import { useParams } from "react-router-dom";

import { getJourneyById } from "../../services/journey.service";


const LiveJourney = () => {
    const { journeyId } = useParams();

    const [tracking, setTracking] =
        useState(false);

    const [location, setLocation] =
        useState(null);

    const [trackingData, setTrackingData] =
        useState(null);

    const [error, setError] =
        useState("");

    const watchIdRef =
        useRef(null);

    const [journey, setJourney] = useState(null);

    const fetchJourney = async () => {

    try {

        const response =
            await getJourneyById(journeyId);

        setJourney(response.data);

    } catch (error) {

        setError(
            "Failed to fetch journey details"
        );

    }

};


    const startTracking = () => {

        setError("");


        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by your browser"
            );

            return;
        }


        watchIdRef.current =
            navigator.geolocation.watchPosition(

                async (position) => {

                    const locationData = {

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude,

                        accuracy:
                            position.coords.accuracy,

                        speed:
                            position.coords.speed !== null
                                ? position.coords.speed
                                : 0,

                        timestamp:
                            new Date(
                                position.timestamp
                            ).toISOString()

                    };


                    setLocation(
                        locationData
                    );


                    try {

                        const response =
                            await sendLocation(
                                journeyId,
                                locationData
                            );


                        setTrackingData(
                            response.data
                        );


                    } catch (error) {

                        console.error(
                            "Failed to send location:",
                            error
                        );

                        setError(
                            error.response?.data?.message ||
                            "Failed to send location"
                        );

                    }

                },


                (error) => {

                    console.error(
                        "Location error:",
                        error
                    );


                    setError(
                        error.message ||
                        "Unable to get location"
                    );

                },


                {
                    enableHighAccuracy: true,

                    maximumAge: 0,

                    timeout: 10000
                }

            );


        setTracking(true);

    };


//     useEffect(() => {

//     const fetchJourney = async () => {

//         try {

//             const response =
//                 await getJourneyById(journeyId);

//             setJourney(response.data);

//         } catch (error) {

//             setError(
//                 error.response?.data?.message ||
//                 "Failed to load journey"
//             );

//         }

//     };

//     fetchJourney();

// }, [journeyId]);

    const stopTracking = () => {

        if (
            watchIdRef.current !== null
        ) {

            navigator.geolocation.clearWatch(
                watchIdRef.current
            );

            watchIdRef.current = null;

        }


        setTracking(false);

    };


    // Stop tracking when component unmounts

    useEffect(() => {

        return () => {

            if (
                watchIdRef.current !== null
            ) {

                navigator.geolocation.clearWatch(
                    watchIdRef.current
                );

            }

        };

    }, []);

    useEffect(() => {

        fetchJourney();

    }, [journeyId]);
    
    
    



    return (

        

        <div className="live-journey-page">


            <div className="page-header">

                <div>

                    <h1>
                        Live Journey
                    </h1>

                    <p>
                        Track your journey in real time.
                    </p>

                </div>


                {!tracking ? (

                    <button
                        className="primary-button"
                        onClick={startTracking}
                    >

                        <Radio size={18} />

                        Start Tracking

                    </button>

                ) : (

                    <button
                        className="danger-button"
                        onClick={stopTracking}
                    >

                        Stop Tracking

                    </button>

                )}

            </div>

            {journey && (

    <div className="journey-summary-card">

        <div>

            <p className="section-label">
                CURRENT JOURNEY
            </p>

            <h2>
                {journey.origin?.name}
                {" → "}
                {journey.destination?.name}
            </h2>

        </div>

        <span
            className={`journey-status ${journey.status.toLowerCase()}`}
        >
            {journey.status}
        </span>

    </div>

)}




            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* Tracking Status */}

            <div className="live-status-card">

                <div className="live-status-indicator">

                    <span
                        className={
                            tracking
                                ? "live-dot active"
                                : "live-dot"
                        }
                    />

                    <span>

                        {tracking
                            ? "Live tracking active"
                            : "Tracking stopped"
                        }

                    </span>

                </div>

            </div>


            {/* Current Location */}

            <div className="live-grid">


                <div className="live-card">

                    <div className="live-card-title">

                        <MapPin size={20} />

                        Current Location

                    </div>


                    {location ? (

                        <div className="location-data">

                            <p>

                                <strong>
                                    Latitude:
                                </strong>

                                {" "}

                                {
                                    location.latitude
                                        .toFixed(6)
                                }

                            </p>


                            <p>

                                <strong>
                                    Longitude:
                                </strong>

                                {" "}

                                {
                                    location.longitude
                                        .toFixed(6)
                                }

                            </p>


                            <p>

                                <strong>
                                    Accuracy:
                                </strong>

                                {" "}

                                {
                                    location.accuracy
                                        ?.toFixed(1)
                                }

                                {" "} meters

                            </p>

                        </div>

                    ) : (

                        <p className="muted-text">

                            Waiting for location...

                        </p>

                    )}

                </div>


                {/* Journey Analysis */}

                <div className="live-card">

                    <div className="live-card-title">

                        <Navigation size={20} />

                        Journey Analysis

                    </div>


                    {trackingData ? (

                        <div className="location-data">

                            <p>

                                <strong>
                                    Distance from destination:
                                </strong>

                                {" "}

                                {
                                    trackingData.analysis
                                        ?.distanceFromDestination
                                        ?.toFixed(2)
                                }

                                {" "} km

                            </p>


                            <p>

                                <strong>
                                    Movement:
                                </strong>

                                {" "}

                                {
                                    trackingData
                                        .movementAnalysis
                                        ?.movementDetected
                                        ? "Moving"
                                        : "Not moving"
                                }

                            </p>


                            <p>

                                <strong>
                                    Direction:
                                </strong>

                                {" "}

                                {
                                    trackingData
                                        .directionAnalysis
                                        ?.movingTowardDestination
                                        ? "Moving toward destination"
                                        : "Not moving toward destination"
                                }

                            </p>

                        </div>

                    ) : (

                        <p className="muted-text">

                            Waiting for journey analysis...

                        </p>

                    )}

                </div>


                {/* ETA */}

                <div className="live-card">

                    <div className="live-card-title">

                        <Clock size={20} />

                        Estimated Arrival

                    </div>


                    {trackingData?.etaAnalysis?.eta ? (

                        <p className="eta-value">

                            {
                                new Date(
                                    trackingData
                                        .etaAnalysis
                                        .eta
                                ).toLocaleTimeString()
                            }

                        </p>

                    ) : (

                        <p className="muted-text">

                            ETA will appear once movement is detected.

                        </p>

                    )}

                </div>


                {/* Battery placeholder */}

                <div className="live-card">

                    <div className="live-card-title">

                        <Battery size={20} />

                        Battery

                    </div>


                    <p className="muted-text">

                        Battery monitoring will be added next.

                    </p>

                </div>


            </div>

        </div>

    );

};


export default LiveJourney;