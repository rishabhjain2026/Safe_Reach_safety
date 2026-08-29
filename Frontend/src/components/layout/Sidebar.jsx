import {
    LayoutDashboard,
    Map,
    MapPin,
    Users,
    Settings
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {

    return (
        <aside className="sidebar">

            <div className="logo">
                SafeReach
            </div>

            <nav className="sidebar-nav">

               <NavLink to="/">
    <LayoutDashboard size={20} />
    <span>Dashboard</span>
</NavLink>

        <NavLink to="/journeys">
            <Map size={20} />
            <span>Journeys</span>
        </NavLink>

        <NavLink to="/places">
            <MapPin size={20} />
            <span>Places</span>
        </NavLink>

        <NavLink to="/contacts">
            <Users size={20} />
            <span>Trusted Contacts</span>
        </NavLink>

        <NavLink to="/settings">
            <Settings size={20} />
            <span>Settings</span>
        </NavLink>

            </nav>

        </aside>
    );
};

export default Sidebar;