import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/api";
import { useAuth } from "../context/useAuth";

function ReceptionistLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        formData
      );

      const { token, user } = response.data;

      if (user.role !== "RECEPTIONIST") {
        setError(
          "This is not a receptionist account."
        );
        return;
      }

      login({
        user,
        token,
      });

      navigate("/receptionist/dashboard");
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

        <h1>Receptionist Login</h1>

        <p>
          Login to add patients and manage queues.
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
            placeholder="reception@hospital.com"
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

export default ReceptionistLogin;