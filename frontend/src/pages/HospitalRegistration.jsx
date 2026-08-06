import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/api";

const initialForm = {
  hospitalName: "",
  hospitalEmail: "",
  phone: "",
  address: "",
  adminName: "",
  adminEmail: "",
  password: "",
  confirmPassword: "",
};

function HospitalRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hospitalCode, setHospitalCode] =
    useState("");

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
    setHospitalCode("");

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
        "/auth/register-hospital",
        {
          hospitalName:
            formData.hospitalName.trim(),

          hospitalEmail:
            formData.hospitalEmail.trim(),

          phone: formData.phone.trim(),

          address:
            formData.address.trim(),

          adminName:
            formData.adminName.trim(),

          adminEmail:
            formData.adminEmail.trim(),

          password: formData.password,
        }
      );

      const code =
        response.data?.hospital?.code;

      setHospitalCode(code || "");

      setSuccess(
        response.data?.message ||
          "Hospital registered successfully."
      );

      setFormData(initialForm);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to register hospital."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goToLogin = () => {
    navigate("/select-role");
  };

  return (
    <main className="auth-page">
      <section className="auth-card hospital-register-card">
        <Link
          to="/"
          className="back-link"
        >
          ← Back
        </Link>

        <h1>Register Your Hospital</h1>

        <p>
          Create your DR.Run hospital workspace.
          After registration, you will receive a
          unique hospital code for doctors and
          receptionists.
        </p>

        {!hospitalCode ? (
          <form onSubmit={handleSubmit}>
            <h3>Hospital Details</h3>

            <label htmlFor="hospitalName">
              Hospital Name
            </label>

            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Enter hospital name"
              required
            />

            <label htmlFor="hospitalEmail">
              Hospital Email
            </label>

            <input
              id="hospitalEmail"
              name="hospitalEmail"
              type="email"
              value={formData.hospitalEmail}
              onChange={handleChange}
              placeholder="hospital@example.com"
              required
            />

            <label htmlFor="phone">
              Hospital Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <label htmlFor="address">
              Hospital Address
            </label>

            <textarea
              id="address"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter hospital address"
            />

            <h3>Administrator Account</h3>

            <label htmlFor="adminName">
              Admin Name
            </label>

            <input
              id="adminName"
              name="adminName"
              type="text"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Enter administrator name"
              required
            />

            <label htmlFor="adminEmail">
              Admin Email
            </label>

            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="admin@example.com"
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
                ? "Creating Hospital..."
                : "Register Hospital"}
            </button>
          </form>
        ) : (
          <div className="hospital-registration-success">
            <h2>Hospital Registered</h2>

            <p>
              Your hospital has been successfully
              registered with DR.Run.
            </p>

            <p>
              Your Hospital Code
            </p>

            <strong className="hospital-code">
              {hospitalCode}
            </strong>

            <p>
              Share this code with your doctors
              and receptionists so they can join
              your hospital.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={goToLogin}
            >
              Continue
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default HospitalRegistration;