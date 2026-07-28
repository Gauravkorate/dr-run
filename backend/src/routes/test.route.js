const express = require("express");
const router = express.Router();

const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res.json({
      success: true,
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;