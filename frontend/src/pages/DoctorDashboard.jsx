import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function DoctorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Doctor Dashboard</h1>

          <p>
            {user?.name} — Room {user?.roomId}
          </p>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <section className="empty-dashboard">
        Current patient and waiting queue will be
        added here.
      </section>
    </main>
  );
}

export default DoctorDashboard;