import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Navigation,
    MapPin,
    Clock,
    Radio
} from "lucide-react";

import { useParams } from "react-router-dom";

import { sendLocation } from "../../services/tracking.service";
import { getJourneyById } from "../../services/journey.service";
import { sendHeartbeat } from "../../services/device.service";


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

    const [journey, setJourney] =
        useState(null);

    const [battery, setBattery] =
        useState(null);


    // Store browser tracking ID
    const watchIdRef =
        useRef(null);

    // Store heartbeat interval
    const heartbeatIntervalRef =
        useRef(null);

    // Store latest battery information
    const batteryRef =
        useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Load Journey
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!journeyId) {
            return;
        }

        let cancelled = false;

        const loadJourney = async () => {

            try {

                const response =
                    await getJourneyById(journeyId);

                if (cancelled) {
                    return;
                }

                setJourney(response.data);

            } catch (error) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to fetch journey:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load journey"
                );
            }
        };

        loadJourney();

        return () => {
            cancelled = true;
        };

    }, [journeyId]);


    /*
    |--------------------------------------------------------------------------
    | Battery Information
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let batteryManager = null;
        let initialUpdateTimeout = null;

        const setupBattery = async () => {

            try {

                if (!navigator.getBattery) {

                    console.log(
                        "Battery API is not supported in this browser"
                    );

                    return;
                }

                batteryManager =
                    await navigator.getBattery();


                const updateBattery = () => {

                    if (!batteryManager) {
                        return;
                    }

                    const batteryData = {
                        level:
                            Math.round(
                                batteryManager.level * 100
                            ),

                        charging:
                            batteryManager.charging
                    };


                    batteryRef.current =
                        batteryData;


                    setBattery(
                        batteryData
                    );
                };


                /*
                 * Delay the first state update so React does not
                 * treat it as a synchronous setState inside the effect.
                 */
                initialUpdateTimeout =
                    setTimeout(() => {

                        updateBattery();

                    }, 0);


                batteryManager.addEventListener(
                    "levelchange",
                    updateBattery
                );

                batteryManager.addEventListener(
                    "chargingchange",
                    updateBattery
                );

            } catch (error) {

                console.error(
                    "Failed to get battery information:",
                    error
                );
            }
        };


        setupBattery();


        return () => {

            if (initialUpdateTimeout) {
                clearTimeout(
                    initialUpdateTimeout
                );
            }


            if (batteryManager) {

                batteryManager.removeEventListener(
                    "levelchange",
                    () => {}
                );

                batteryManager.removeEventListener(
                    "chargingchange",
                    () => {}
                );
            }
        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Start Heartbeat
    |--------------------------------------------------------------------------
    */

    const startHeartbeat = () => {

        /*
         * Prevent multiple heartbeat intervals.
         */
        if (
            heartbeatIntervalRef.current !== null
        ) {
            return;
        }


        /*
         * Send heartbeat immediately.
         */
        const sendInitialHeartbeat =
            async () => {

                try {

                    await sendHeartbeat(
                        journeyId
                    );

                    console.log(
                        "Heartbeat sent"
                    );

                } catch (error) {

                    console.error(
                        "Heartbeat failed:",
                        error
                    );
                }
            };


        sendInitialHeartbeat();


        /*
         * Send heartbeat every 30 seconds.
         */
        heartbeatIntervalRef.current =
            setInterval(
                async () => {

                    try {

                        await sendHeartbeat(
                            journeyId
                        );

                        console.log(
                            "Heartbeat sent"
                        );

                    } catch (error) {

                        console.error(
                            "Heartbeat failed:",
                            error
                        );
                    }

                },
                30 * 1000
            );
    };


    /*
    |--------------------------------------------------------------------------
    | Stop Heartbeat
    |--------------------------------------------------------------------------
    */

    const stopHeartbeat = () => {

        if (
            heartbeatIntervalRef.current !== null
        ) {

            clearInterval(
                heartbeatIntervalRef.current
            );

            heartbeatIntervalRef.current =
                null;
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Start Tracking
    |--------------------------------------------------------------------------
    */

    const startTracking = () => {

        setError("");


        /*
         * Prevent starting multiple GPS watchers.
         */
        if (
            watchIdRef.current !== null
        ) {

            return;
        }


        /*
         * Check browser GPS support.
         */
        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by your browser"
            );

            return;
        }


        /*
         * Start watching user's location.
         */
        watchIdRef.current =
            navigator.geolocation.watchPosition(

                async (position) => {

                    /*
                     * Always use the latest battery value
                     * from the ref.
                     */
                    const currentBattery =
                        batteryRef.current;


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
                            ).toISOString(),

                        batteryLevel:
                            currentBattery
                                ? currentBattery.level
                                : null,

                        isCharging:
                            currentBattery
                                ? currentBattery.charging
                                : null
                    };


                    /*
                     * Show location immediately in UI.
                     */
                    setLocation(
                        locationData
                    );


                    /*
                     * Send location to backend.
                     */
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


                /*
                 * GPS error callback
                 */
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


                /*
                 * GPS options
                 */
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000
                }
            );


        /*
         * Update UI.
         */
        setTracking(true);


        /*
         * Start device heartbeat.
         */
        startHeartbeat();
    };


    /*
    |--------------------------------------------------------------------------
    | Stop Tracking
    |--------------------------------------------------------------------------
    */

    const stopTracking = () => {

        /*
         * Stop GPS watcher.
         */
        if (
            watchIdRef.current !== null
        ) {

            navigator.geolocation.clearWatch(
                watchIdRef.current
            );

            watchIdRef.current =
                null;
        }


        /*
         * Stop heartbeat.
         */
        stopHeartbeat();


        /*
         * Update UI.
         */
        setTracking(false);
    };


    /*
    |--------------------------------------------------------------------------
    | Cleanup when page/component is closed
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        return () => {

            /*
             * Stop GPS watcher.
             */
            if (
                watchIdRef.current !== null
            ) {

                navigator.geolocation.clearWatch(
                    watchIdRef.current
                );

                watchIdRef.current =
                    null;
            }


            /*
             * Stop heartbeat interval.
             */
            if (
                heartbeatIntervalRef.current !== null
            ) {

                clearInterval(
                    heartbeatIntervalRef.current
                );

                heartbeatIntervalRef.current =
                    null;
            }
        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="live-journey-page">


            {/* --------------------------------------------------------- */}
            {/* Header */}
            {/* --------------------------------------------------------- */}

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


            {/* --------------------------------------------------------- */}
            {/* Journey Summary */}
            {/* --------------------------------------------------------- */}

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
                        className={`journey-status ${
                            journey.status?.toLowerCase() || ""
                        }`}
                    >

                        {journey.status}

                    </span>

                </div>

            )}


            {/* --------------------------------------------------------- */}
            {/* Error */}
            {/* --------------------------------------------------------- */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* --------------------------------------------------------- */}
            {/* Tracking Status */}
            {/* --------------------------------------------------------- */}

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


            {/* --------------------------------------------------------- */}
            {/* Main Grid */}
            {/* --------------------------------------------------------- */}

            <div className="live-grid">


                {/* ----------------------------------------------------- */}
                {/* Current Location */}
                {/* ----------------------------------------------------- */}

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
                                    typeof location.latitude === "number"
                                        ? location.latitude.toFixed(6)
                                        : "-"
                                }

                            </p>


                            <p>

                                <strong>
                                    Longitude:
                                </strong>

                                {" "}

                                {
                                    typeof location.longitude === "number"
                                        ? location.longitude.toFixed(6)
                                        : "-"
                                }

                            </p>


                            <p>

                                <strong>
                                    Accuracy:
                                </strong>

                                {" "}

                                {
                                    typeof location.accuracy === "number"
                                        ? location.accuracy.toFixed(1)
                                        : "-"
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


                {/* ----------------------------------------------------- */}
                {/* Journey Analysis */}
                {/* ----------------------------------------------------- */}

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
                                    typeof trackingData
                                        .analysis
                                        ?.distanceFromDestination === "number"

                                        ? trackingData
                                            .analysis
                                            .distanceFromDestination
                                            .toFixed(2)

                                        : "-"
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


                {/* ----------------------------------------------------- */}
                {/* ETA */}
                {/* ----------------------------------------------------- */}

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


                {/* ----------------------------------------------------- */}
                {/* Battery */}
                {/* ----------------------------------------------------- */}

                <div className="battery-card">

                    <p className="section-label">
                        DEVICE BATTERY
                    </p>


                    {battery ? (

                        <>

                            <h2>

                                🔋 {battery.level}%

                            </h2>


                            <p>

                                {battery.charging
                                    ? "Charging"
                                    : "Not charging"
                                }

                            </p>

                        </>

                    ) : (

                        <p>

                            Battery information is not available

                        </p>

                    )}

                </div>


            </div>

        </div>

    );
};


export default LiveJourney;