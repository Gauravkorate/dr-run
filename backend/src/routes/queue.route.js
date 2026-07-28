const express = require("express");

const {
  addPatientToQueue,
  getQueueByRoom,
} = require("../controllers/queue.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", addPatientToQueue);
router.get("/room/:roomId", getQueueByRoom);

module.exports = router;