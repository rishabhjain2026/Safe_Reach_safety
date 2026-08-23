import {
    MapPin,
    Clock,
    BatteryMedium,
    Wifi,
    ShieldCheck,
    ArrowRight
} from "lucide-react";

const Dashboard = () => {

    // Temporary data.
    // Later this will come from our backend.
    const journey = {
        origin: "Rani Kamlapati",
        destination: "Hostel",
        status: "ACTIVE",
        distanceRemaining: 4.2,
        eta: 18,
        battery: 67,
        deviceStatus: "Connected"
    };

    return (
        <div className="dashboard">

            {/* Welcome section */}

            <div className="welcome-section">

                <h1>
                    Good afternoon, Rishabh 👋
                </h1>

                <p>
                    Here's your current journey status.
                </p>

            </div>


            {/* Current Journey */}

            <div className="journey-card">

                <div className="journey-card-header">

                    <div>
                        <p className="section-label">
                            CURRENT JOURNEY
                        </p>

                        <h2>
                            {journey.origin}
                            <ArrowRight size={20} />
                            {journey.destination}
                        </h2>
                    </div>

                    <div className="status-badge">
                        <span className="status-dot"></span>
                        {journey.status}
                    </div>

                </div>


                {/* Journey statistics */}

                <div className="journey-stats">

                    <div className="stat">

                        <MapPin size={22} />

                        <div>
                            <strong>
                                {journey.distanceRemaining} km
                            </strong>

                            <span>
                                Remaining
                            </span>
                        </div>

                    </div>


                    <div className="stat">

                        <Clock size={22} />

                        <div>
                            <strong>
                                {journey.eta} min
                            </strong>

                            <span>
                                ETA
                            </span>
                        </div>

                    </div>


                    <div className="stat">

                        <BatteryMedium size={22} />

                        <div>
                            <strong>
                                {journey.battery}%
                            </strong>

                            <span>
                                Battery
                            </span>
                        </div>

                    </div>


                    <div className="stat">

                        <Wifi size={22} />

                        <div>
                            <strong>
                                {journey.deviceStatus}
                            </strong>

                            <span>
                                Device
                            </span>
                        </div>

                    </div>

                </div>


                <button className="view-journey-button">
                    View Journey
                    <ArrowRight size={18} />
                </button>

            </div>


            {/* Bottom cards */}

            <div className="dashboard-grid">

                <div className="info-card">

                    <div className="info-card-icon">
                        <ShieldCheck size={24} />
                    </div>

                    <div>
                        <p className="section-label">
                            SAFETY STATUS
                        </p>

                        <h3>
                            You're on track
                        </h3>

                        <p>
                            No safety issues detected.
                        </p>
                    </div>

                </div>


                <div className="info-card">

                    <div className="info-card-icon">
                        <MapPin size={24} />
                    </div>

                    <div>
                        <p className="section-label">
                            JOURNEY STATUS
                        </p>

                        <h3>
                            Journey active
                        </h3>

                        <p>
                            SafeReach is monitoring your journey.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;