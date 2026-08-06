const express = require("express");

const router = express.Router();

const {
  register,
  login,
  registerHospital,
  registerStaff,
} = require("../controllers/auth.controller");

router.post(
  "/register-hospital",
  registerHospital
);

router.post(
  "/register-staff",
  registerStaff
);

router.post("/register", register);

router.post("/login", login);

module.exports = router;