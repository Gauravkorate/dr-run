const express = require("express");

const {
  createRoom,
  getRooms,
  assignDoctorToRoom,
} = require("../controllers/room.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createRoom);
router.get("/", getRooms);
router.patch("/:id/assign-doctor", assignDoctorToRoom);

module.exports = router;