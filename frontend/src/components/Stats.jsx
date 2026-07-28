import { motion } from "framer-motion";
import {
  FaBolt,
  FaChartLine,
  FaClock,
  FaUsers,
} from "react-icons/fa6";

import "../styles/stats.css";

const statistics = [
  {
    icon: <FaClock />,
    value: "95%",
    title: "Less Waiting Confusion",
    description:
      "Patients and hospital staff can clearly see the live queue status.",
  },
  {
    icon: <FaUsers />,
    value: "100%",
    title: "Digital Patient Queue",
    description:
      "Patient registration and token management are handled digitally.",
  },
  {
    icon: <FaBolt />,
    value: "Real-Time",
    title: "Instant Synchronization",
    description:
      "Receptionist and doctor dashboards update through Socket.IO.",
  },
  {
    icon: <FaChartLine />,
    value: "1 Click",
    title: "Call Next Patient",
    description:
      "Doctors can call the next waiting patient with one simple action.",
  },
];

function Stats() {
  return (
    <section className="stats-section" id="stats">
      <div className="stats-container">
        <motion.div
          className="stats-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="stats-badge">
            Smarter Hospital Management
          </span>

          <h2>
            Simple technology with a
            <span> powerful impact</span>
          </h2>

          <p>
            DR.Run improves communication between receptionists,
            doctors and patients while reducing manual queue work.
          </p>
        </motion.div>

        <div className="stats-grid">
          {statistics.map((stat, index) => (
            <motion.article
              className="stat-item"
              key={stat.title}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              whileHover={{
                y: -8,
              }}
            >
              <div className="stat-icon">
                {stat.icon}
              </div>

              <strong>{stat.value}</strong>

              <h3>{stat.title}</h3>

              <p>{stat.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="stats-demo"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div className="stats-demo-content">
            <span className="stats-demo-label">
              Live Queue Preview
            </span>

            <h3>Everything updates automatically</h3>

            <p>
              When the receptionist adds a patient or the doctor
              calls the next token, every connected dashboard receives
              the update immediately.
            </p>
          </div>

          <div className="live-preview">
            <div className="live-preview-header">
              <div>
                <span className="live-dot" />
                Live Queue
              </div>

              <strong>Room 101</strong>
            </div>

            <div className="preview-token current">
              <span>Token 24</span>
              <strong>In Consultation</strong>
            </div>

            <div className="preview-token">
              <span>Token 25</span>
              <strong>Next Patient</strong>
            </div>

            <div className="preview-token">
              <span>Token 26</span>
              <strong>Waiting</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;