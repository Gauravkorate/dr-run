import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/api";
import { useAuth } from "../context/useAuth";

function DoctorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roomId: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { token, user } = response.data;

      if (user.role !== "DOCTOR") {
        setError(
          "This is not a doctor account."
        );
        return;
      }

      if (
        user.roomId &&
        user.roomId !== formData.roomId
      ) {
        setError(
          "Room ID does not match this doctor."
        );
        return;
      }

      const doctorUser = {
        ...user,
        roomId: formData.roomId,
      };

      login({
        user: doctorUser,
        token,
      });

      navigate("/doctor/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="back-link">
          ← Back
        </Link>

        <h1>Doctor Login</h1>

        <p>
          Login to access your assigned room queue.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@hospital.com"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <label htmlFor="roomId">
            Room ID
          </label>

          <input
            id="roomId"
            name="roomId"
            type="text"
            value={formData.roomId}
            onChange={handleChange}
            placeholder="101"
            required
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default DoctorLogin;