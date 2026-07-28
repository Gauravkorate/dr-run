const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/room.route");
const queueRoutes = require("./routes/queue.route");
const doctorRoutes = require("./routes/doctor.route");
const patientRoutes =
  require("./routes/patient.route");
const authRoutes =
  require("./routes/auth.route");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/doctor", doctorRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Dr.Run API Running"
  });
});

module.exports = app;