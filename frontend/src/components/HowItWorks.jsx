import { motion } from "framer-motion";

import {
  FaUserPlus,
  FaUserDoctor,
  FaBell,
  FaArrowRight,
} from "react-icons/fa6";

import "../styles/how.css";

const steps = [
  {
    id: "01",
    icon: <FaUserPlus />,
    title: "Receptionist Registers Patient",
    description:
      "Receptionist enters patient details, selects the doctor's room and generates a unique token instantly.",
  },
  {
    id: "02",
    icon: <FaUserDoctor />,
    title: "Doctor Views Live Queue",
    description:
      "Doctors can see the real-time waiting list and simply click 'Call Next' when they are ready.",
  },
  {
    id: "03",
    icon: <FaBell />,
    title: "Patient Gets Notified",
    description:
      "Patient receives an SMS notification and proceeds directly to the consultation room.",
  },
];

function HowItWorks() {
  return (
    <section className="how-section" id="work">
      <div className="container">

        <motion.div
          className="how-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge">
            Simple Workflow
          </span>

          <h2>
            How
            <span> DR.Run </span>
            Works
          </h2>

          <p>
            DR.Run simplifies the complete patient
            journey from registration to consultation
            using live updates and smart queue
            management.
          </p>
        </motion.div>

        <div className="workflow">

          {steps.map((step, index) => (

            <motion.div
              key={step.id}
              className="workflow-card"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * .25
              }}
              viewport={{ once: true }}
            >

              <div className="step-number">

                {step.id}

              </div>

              <div className="workflow-icon">

                {step.icon}

              </div>

              <h3>

                {step.title}

              </h3>

              <p>

                {step.description}

              </p>

            </motion.div>

          ))}

        </div>

        <div className="workflow-arrows">

          <FaArrowRight />

          <FaArrowRight />

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;