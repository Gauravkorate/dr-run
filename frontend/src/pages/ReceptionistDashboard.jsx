import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { useAuth } from "../context/useAuth";
import socket from "../socket/socket";

const initialFormData = {
  name: "",
  age: "",
  phone: "",
  issue: "",
  roomId: "",
};

function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [queue, setQueue] = useState([]);

  const [addingPatient, setAddingPatient] =
    useState(false);

  const [loadingQueue, setLoadingQueue] =
    useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const fetchQueue = useCallback(async (roomId) => {
    if (!roomId) {
      return;
    }

    setLoadingQueue(true);
    setError("");

    try {
      const response = await api.get(
        `/patient/queue/${roomId}`
      );

      const queueData =
        response.data.patients ??
        response.data.queue ??
        response.data;

      setQueue(
        Array.isArray(queueData) ? queueData : []
      );
    } catch (requestError) {
      setQueue([]);

      setError(
        requestError.response?.data?.message ||
          "Unable to load patient queue."
      );
    } finally {
      setLoadingQueue(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedRoom) {
      return undefined;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", selectedRoom);

    const refreshQueue = () => {
      void fetchQueue(selectedRoom);
    };

    socket.on("patient-added", refreshQueue);
    socket.on("patient-called", refreshQueue);
    socket.on("patient-completed", refreshQueue);
    socket.on("patient-skipped", refreshQueue);

    return () => {
      socket.off("patient-added", refreshQueue);
      socket.off("patient-called", refreshQueue);
      socket.off("patient-completed", refreshQueue);
      socket.off("patient-skipped", refreshQueue);
    };
  }, [selectedRoom, fetchQueue]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleViewQueue = async (event) => {
    event.preventDefault();

    const roomId = formData.roomId.trim();

    if (!roomId) {
      setError("Please enter a doctor room number.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setSelectedRoom(roomId);

    await fetchQueue(roomId);
  };

  const validatePatient = (patientData) => {
    if (
      !patientData.name ||
      !patientData.age ||
      !patientData.phone ||
      !patientData.issue ||
      !patientData.roomId
    ) {
      return "Please fill in all patient details.";
    }

    if (
      patientData.age < 1 ||
      patientData.age > 120
    ) {
      return "Please enter a valid patient age.";
    }

    if (!/^\d{10}$/.test(patientData.phone)) {
      return "Phone number must contain exactly 10 digits.";
    }

    return null;
  };

  const handleAddPatient = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const patientData = {
      name: formData.name.trim(),
      age: Number(formData.age),
      phone: formData.phone.trim(),
      issue: formData.issue.trim(),
      roomId: formData.roomId.trim(),
    };

    const validationError =
      validatePatient(patientData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setAddingPatient(true);

    try {
      const response = await api.post(
        "/patient",
        patientData
      );

      const addedPatient =
        response.data.patient ?? response.data;

      setSelectedRoom(patientData.roomId);

      setSuccessMessage(
        addedPatient?.tokenNumber
          ? `Patient added successfully. Token number: ${addedPatient.tokenNumber}`
          : "Patient added successfully."
      );

      setFormData({
        ...initialFormData,
        roomId: patientData.roomId,
      });

      await fetchQueue(patientData.roomId);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to add patient."
      );
    } finally {
      setAddingPatient(false);
    }
  };

  const handleRefreshQueue = async () => {
    await fetchQueue(selectedRoom);
  };

  const handleLogout = () => {
    socket.disconnect();
    logout();
    navigate("/");
  };

  const waitingCount = queue.filter(
    (patient) => patient.status === "WAITING"
  ).length;

  const inProgressCount = queue.filter(
    (patient) => patient.status === "IN_CONSULTATION"
  ).length;

  return (
    <main className="reception-dashboard">
      <header className="reception-header">
        <div>
          <p className="dashboard-label">
            Dr.Run Hospital Queue System
          </p>

          <h1>Receptionist Dashboard</h1>

          <p>
            Welcome, {user?.name || "Receptionist"}
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

      <section className="dashboard-stats">
        <article className="stat-card">
          <span>Selected Room</span>
          <strong>
            {selectedRoom || "Not selected"}
          </strong>
        </article>

        <article className="stat-card">
          <span>Waiting Patients</span>
          <strong>{waitingCount}</strong>
        </article>

        <article className="stat-card">
          <span>In Consultation</span>
          <strong>{inProgressCount}</strong>
        </article>

        <article className="stat-card">
          <span>Total in Queue</span>
          <strong>{queue.length}</strong>
        </article>
      </section>

      {(error || successMessage) && (
        <section className="dashboard-message-area">
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="success-message">
              {successMessage}
            </p>
          )}
        </section>
      )}

      <section className="reception-content">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <h2>Add New Patient</h2>

            <p>
              Enter patient and assigned room details.
            </p>
          </div>

          <form
            className="patient-form"
            onSubmit={handleAddPatient}
          >
            <div className="form-group">
              <label htmlFor="name">
                Patient Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>

                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="issue">
                Patient Issue
              </label>

              <textarea
                id="issue"
                name="issue"
                rows="4"
                value={formData.issue}
                onChange={handleInputChange}
                placeholder="Describe patient's issue"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomId">
                Doctor Room Number
              </label>

              <input
                id="roomId"
                name="roomId"
                type="text"
                value={formData.roomId}
                onChange={handleInputChange}
                placeholder="Example: 101"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={addingPatient}
            >
              {addingPatient
                ? "Adding Patient..."
                : "Add Patient"}
            </button>
          </form>
        </article>

        <article className="dashboard-panel queue-panel">
          <div className="panel-heading queue-heading">
            <div>
              <h2>Live Patient Queue</h2>

              <p>
                {selectedRoom
                  ? `Showing Room ${selectedRoom}`
                  : "Enter a room number to view its queue."}
              </p>
            </div>

            <button
              type="button"
              className="refresh-button"
              disabled={
                !selectedRoom || loadingQueue
              }
              onClick={handleRefreshQueue}
            >
              {loadingQueue
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>

          <form
            className="room-search-form"
            onSubmit={handleViewQueue}
          >
            <input
              name="roomId"
              type="text"
              value={formData.roomId}
              onChange={handleInputChange}
              placeholder="Enter room number"
            />

            <button type="submit">
              View Queue
            </button>
          </form>

          {loadingQueue ? (
            <div className="queue-empty">
              Loading patient queue...
            </div>
          ) : queue.length === 0 ? (
            <div className="queue-empty">
              {selectedRoom
                ? `No patients found in Room ${selectedRoom}.`
                : "Select a room to view patients."}
            </div>
          ) : (
            <div className="queue-table-wrapper">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Issue</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {queue.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <span className="token-number">
                          {patient.tokenNumber}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {patient.name}
                        </strong>

                        <small>
                          {patient.phone}
                        </small>
                      </td>

                      <td>{patient.age}</td>

                      <td className="issue-cell">
                        {patient.issue}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${patient.status?.toLowerCase()}`}
                        >
                          {patient.status
                            ?.replaceAll("_", " ")
                            .toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default ReceptionistDashboard;