const prisma = require("../config/prisma");

const getMyQueue = async (req, res) => {
  try {
    const doctorId = Number(
  req.user.userId || req.user.id
);
    const hospitalId = req.user.hospitalId;

    const room = await prisma.room.findFirst({
      where: {
        currentDoctorId: doctorId,
        hospitalId,
        isActive: true,
      },
    });

    if (!room) {
      return res.status(404).json({
        message:
          "No active room is assigned to this doctor",
      });
    }

    const queue = await prisma.queueEntry.findMany({
      where: {
        roomId: room.id,
        status: {
          in: ["WAITING", "CALLED", "IN_CONSULTATION"],
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        tokenNumber: "asc",
      },
    });

    return res.status(200).json({
      room,
      queue,
    });
  } catch (error) {
    console.error("Doctor queue error:", error);

    return res.status(500).json({
      message: "Unable to load doctor queue",
    });
  }
};

module.exports = {
  getMyQueue,
};