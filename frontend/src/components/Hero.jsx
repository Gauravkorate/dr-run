import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaUserMd,
  FaHospital,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <motion.p
          className="hero-tag"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
        >
          Modern Hospital Queue Management
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .2 }}
        >
          Skip Waiting.

          <span> Save Time.</span>

          <br />

          Manage Patients

          <br />

          Smarter with

          <span> DR.Run</span>

        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .5 }}
        >
          DR.Run is an intelligent hospital queue
          management system that helps receptionists,
          doctors and patients stay connected with
          live queues, smart token management and
          real-time updates.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .8 }}
        >
          <Link
            to="/select-role"
            className="primary-btn"
          >
            Enter Hospital

            <FaArrowRight />
          </Link>

          <a
            href="#features"
            className="secondary-btn"
          >
            Explore Features
          </a>

        </motion.div>

      </div>

      <div className="hero-right">

        <motion.div
          className="circle"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="hospital-card big"
          animate={{
            y: [0, -12, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        >
          <FaHospital />

          <h3>Digital Hospital</h3>

          <p>
            Smart Queue System
          </p>

        </motion.div>

        <motion.div
          className="hospital-card left"
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        >
          <FaUserMd />

          <span>

            Doctors

          </span>

        </motion.div>

        <motion.div
          className="hospital-card right"
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity
          }}
        >
          <FaClock />

          <span>

            Live Queue

          </span>

        </motion.div>

        <motion.div
          className="dashboard-preview"
          initial={{
            opacity: 0,
            scale: .8
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: .8
          }}
        >

          <div className="dash-header">

            DR.Run Dashboard

          </div>

          <div className="dash-body">

            <div className="dash-row">

              <span>Today's Patients</span>

              <strong>48</strong>

            </div>

            <div className="dash-row">

              <span>Waiting</span>

              <strong>12</strong>

            </div>

            <div className="dash-row">

              <span>In Consultation</span>

              <strong>3</strong>

            </div>

            <div className="dash-row">

              <span>Completed</span>

              <strong>33</strong>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;