import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserDoctor, FaLaptopMedical } from "react-icons/fa6";

import "./RoleSelection.css";

function RoleSelection() {
  return (
    <div className="role-page">

      <motion.div
        className="role-box"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
      >

        <h1>Welcome to DR.Run</h1>

        <p>
          Choose your role to continue
        </p>

        <div className="role-container">

          <motion.div
            whileHover={{
              scale: 1.05
            }}
            className="role-card"
          >

            <FaUserDoctor className="role-icon" />

            <h2>Doctor</h2>

            <p>
              View live queue, call patients and
              complete consultations.
            </p>

            <Link
              to="/doctor/login"
              className="role-btn"
            >
              Doctor Login
            </Link>

          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05
            }}
            className="role-card"
          >

            <FaLaptopMedical className="role-icon" />

            <h2>Receptionist</h2>

            <p>
              Register patients, generate tokens
              and manage the waiting queue.
            </p>

            <Link
              to="/receptionist/login"
              className="role-btn"
            >
              Receptionist Login
            </Link>

          </motion.div>

        </div>

      </motion.div>

    </div>
  );
}

export default RoleSelection;