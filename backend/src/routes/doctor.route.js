const express = require("express");

const {
  getMyQueue,
} = require("../controllers/doctor.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/my-queue", getMyQueue);

module.exports = router;