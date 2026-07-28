import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaBell,
  FaClock,
  FaDesktop,
  FaHospitalUser,
  FaListOl,
  FaUserDoctor,
} from "react-icons/fa6";

import "../styles/features.css";

const features = [
  {
    icon: <FaHospitalUser />,
    title: "Quick Patient Registration",
    description:
      "The receptionist enters the patient's basic details, medical issue and doctor room number in one simple form.",
  },
  {
    icon: <FaListOl />,
    title: "Automatic Token Generation",
    description:
      "Every registered patient receives a unique token number automatically, reducing manual mistakes.",
  },
  {
    icon: <FaUserDoctor />,
    title: "Doctor Queue Management",
    description:
      "Doctors can see all waiting patients for their room and call the next patient with one click.",
  },
  {
    icon: <FaDesktop />,
    title: "Live Dashboard Updates",
    description:
      "The receptionist and doctor dashboards update immediately whenever the queue changes.",
  },
  {
    icon: <FaBell />,
    title: "Patient SMS Notification",
    description:
      "When the doctor calls a patient, an SMS can notify them to enter the assigned consultation room.",
  },
  {
    icon: <FaClock />,
    title: "Consultation Time Tracking",
    description:
      "DR.Run records consultation start and completion times to help hospitals understand patient flow.",
  },
];

function Features() {
  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <motion.div
          className="features-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge">
            DR.Run Features
          </span>

          <h2>
            Simple tools for
            <span> better patient management</span>
          </h2>

          <p>
            Every feature is designed to make hospital queue
            management easy for receptionists and doctors.
          </p>
        </motion.div>

        <div className="features-list">
          {features.map((feature, index) => (
            <motion.article
              className="simple-feature-card"
              key={feature.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <div className="simple-feature-icon">
                {feature.icon}
              </div>

              <div className="simple-feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="features-action"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h3>Manage hospital queues without confusion</h3>

            <p>
              Register patients, maintain live queues and help doctors
              manage consultations from one connected system.
            </p>
          </div>

          <Link to="/select-role">
            Start Using DR.Run
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Features;