import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  hospitalCode: "",
  phone: "",
  specialization: "",
};

function StaffRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(
        "/auth/register-staff",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          hospitalCode:
            formData.hospitalCode
              .trim()
              .toUpperCase(),
          phone: formData.phone.trim(),

          specialization:
            formData.role === "DOCTOR"
              ? formData.specialization.trim()
              : undefined,
        }
      );

      setSuccess(
        response.data?.message ||
          "Registration successful."
      );

      setFormData(initialForm);

      setTimeout(() => {
        if (response.data?.user?.role === "DOCTOR") {
          navigate("/doctor/login");
        } else {
          navigate("/receptionist/login");
        }
      }, 1200);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to register."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link
          to="/select-role"
          className="back-link"
        >
          ← Back
        </Link>

        <h1>Staff Registration</h1>

        <p>
          Register as a doctor or receptionist
          using the hospital code provided by your
          hospital.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="phone">
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          <label htmlFor="role">
            Role
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">
              Select your role
            </option>

            <option value="DOCTOR">
              Doctor
            </option>

            <option value="RECEPTIONIST">
              Receptionist
            </option>
          </select>

          {formData.role === "DOCTOR" && (
            <>
              <label htmlFor="specialization">
                Specialization
              </label>

              <input
                id="specialization"
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Example: Cardiology"
              />
            </>
          )}

          <label htmlFor="hospitalCode">
            Hospital Code
          </label>

          <input
            id="hospitalCode"
            name="hospitalCode"
            type="text"
            value={formData.hospitalCode}
            onChange={handleChange}
            placeholder="Enter hospital code"
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
            placeholder="Create password"
            required
          />

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? "Registering..."
              : "Register"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default StaffRegistration;