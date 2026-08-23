import { Bell, UserCircle } from "lucide-react";

const Navbar = () => {

    return (
        <header className="navbar">

            <div className="navbar-title">
                Dashboard
            </div>

            <div className="navbar-actions">

                <button className="icon-button">
                    <Bell size={20} />
                </button>

                <div className="profile">
                    <UserCircle size={24} />
                    <span>Rishabh</span>
                </div>

            </div>

        </header>
    );
};

export default Navbar;