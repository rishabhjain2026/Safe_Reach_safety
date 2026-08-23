import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {

    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-section">

                <Navbar />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default Layout;