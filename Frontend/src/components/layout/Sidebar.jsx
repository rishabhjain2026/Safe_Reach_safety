import {
    LayoutDashboard,
    Map,
    MapPin,
    Users,
    Settings
} from "lucide-react";

const Sidebar = () => {

    return (
        <aside className="sidebar">

            <div className="logo">
                SafeReach
            </div>

            <nav className="sidebar-nav">

                <a href="/">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </a>

                <a href="/journeys">
                    <Map size={20} />
                    <span>Journeys</span>
                </a>

                <a href="/places">
                    <MapPin size={20} />
                    <span>Places</span>
                </a>

                <a href="/contacts">
                    <Users size={20} />
                    <span>Trusted Contacts</span>
                </a>

                <a href="/settings">
                    <Settings size={20} />
                    <span>Settings</span>
                </a>

            </nav>

        </aside>
    );
};

export default Sidebar;