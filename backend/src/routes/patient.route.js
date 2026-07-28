const express = require("express");
const router = express.Router();

const {
  addPatient,
  getQueue,
  callNext,
  startConsultation,
  completePatient,
} = require("../controllers/patient.controller");

const authenticate = require("../middleware/auth.middleware");

router.post("/", authenticate, addPatient);

router.get("/queue/:roomId", authenticate, getQueue);

router.patch(
  "/call-next/:roomId",
  authenticate,
  callNext
);

router.patch(
  "/start/:queueEntryId",
  authenticate,
  startConsultation
);

router.patch(
  "/complete/:queueEntryId",
  authenticate,
  completePatient
);

module.exports = router;