import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard/Dashboard";

import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Places from "./pages/Places/Places";
import Contacts from "./pages/Contacts/Contacts";
import Journeys from "./pages/Journeys/Journeys";
import LiveJourney from "./pages/LiveJourney/LiveJourney";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login does not use Sidebar */}

        <Route path="/login" element={<Login />} />

        {/* Main application */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />

                  <Route path="/places" element={<Places />} />

                  <Route
                    path="/contacts"
                    element={<Contacts />}
                  />

                  <Route
                    path="/journeys"
                    element={<Journeys />}
                  />

                  <Route
                    path="/live-journey/:journeyId"
                    element={<LiveJourney />}
                  />


                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
