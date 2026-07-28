import { motion } from "framer-motion";
import {
  FaClock,
  FaClipboardList,
  FaUserDoctor,
  FaUsers,
} from "react-icons/fa6";

import "../styles/why.css";

const problems = [
  {
    icon: <FaClock />,
    title: "Long Waiting Time",
    description:
      "Patients often wait for hours without knowing when their turn will come.",
  },
  {
    icon: <FaClipboardList />,
    title: "Manual Token System",
    description:
      "Receptionists manage patient records and token numbers manually, which can cause mistakes.",
  },
  {
    icon: <FaUserDoctor />,
    title: "No Live Doctor Queue",
    description:
      "Doctors do not always have a clear and updated view of the patients waiting outside.",
  },
  {
    icon: <FaUsers />,
    title: "Crowded Waiting Areas",
    description:
      "Patients stay near the consultation room because they are afraid of missing their turn.",
  },
];

function Why() {
  return (
    <section className="why-section" id="why">
      <div className="why-container">
        <motion.div
          className="why-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge">Why DR.Run?</span>

          <h2>
            Hospital queues should not waste
            <span> valuable time</span>
          </h2>

          <p>
            Many hospitals and clinics still depend on paper tokens,
            manual announcements and crowded waiting rooms. DR.Run
            changes this by creating a simple and live digital queue.
          </p>
        </motion.div>

        <div className="why-content">
          <motion.div
            className="why-visual"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <div className="waiting-card">
              <div className="waiting-card-header">
                <div>
                  <span>Hospital Queue</span>
                  <h3>Waiting Room</h3>
                </div>

                <div className="live-indicator">
                  <span />
                  Live
                </div>
              </div>

              <div className="current-token">
                <p>Current Token</p>
                <strong>24</strong>
                <span>Room 101</span>
              </div>

              <div className="waiting-list">
                <div className="waiting-patient active">
                  <div className="patient-number">24</div>

                  <div>
                    <strong>In Consultation</strong>
                    <span>Doctor Room 101</span>
                  </div>
                </div>

                <div className="waiting-patient">
                  <div className="patient-number">25</div>

                  <div>
                    <strong>Next Patient</strong>
                    <span>Please stay ready</span>
                  </div>
                </div>

                <div className="waiting-patient">
                  <div className="patient-number">26</div>

                  <div>
                    <strong>Waiting</strong>
                    <span>2 patients ahead</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="floating-time-card"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaClock />

              <div>
                <strong>Save Time</strong>
                <span>Know the live queue</span>
              </div>
            </motion.div>

            <motion.div
              className="floating-status-card"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="status-dot" />

              <div>
                <strong>Queue Updated</strong>
                <span>Real-time synchronization</span>
              </div>
            </motion.div>
          </motion.div>

          <div className="problem-grid">
            {problems.map((problem, index) => (
              <motion.article
                className="problem-card"
                key={problem.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
              >
                <div className="problem-icon">
                  {problem.icon}
                </div>

                <h3>{problem.title}</h3>

                <p>{problem.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Why;