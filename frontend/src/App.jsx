import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelection";
import ReceptionistLogin from "./pages/ReceptionistLogin";
import DoctorLogin from "./pages/DoctorLogin";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/select-role"
          element={<RoleSelection />}
        />

        <Route
          path="/receptionist/login"
          element={<ReceptionistLogin />}
        />

        <Route
          path="/doctor/login"
          element={<DoctorLogin />}
        />

        <Route
          path="/receptionist/dashboard"
          element={<ReceptionistDashboard />}
        />

        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div>
                <h1>Page not found</h1>
                <a href="/">Return to DR.Run</a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;