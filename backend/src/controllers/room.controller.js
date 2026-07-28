const prisma = require("../config/prisma");

const createRoom = async (req, res) => {
  try {
    const { roomNumber, name, department } = req.body;
    const hospitalId = req.user.hospitalId;

    if (!roomNumber) {
      return res.status(400).json({
        message: "Room number is required",
      });
    }

    const existingRoom = await prisma.room.findUnique({
      where: {
        hospitalId_roomNumber: {
          hospitalId,
          roomNumber: String(roomNumber).trim(),
        },
      },
    });

    if (existingRoom) {
      return res.status(409).json({
        message: "This room already exists in your hospital",
      });
    }

    const room = await prisma.room.create({
      data: {
        roomNumber: String(roomNumber).trim(),
        name: name?.trim() || null,
        department: department?.trim() || null,
        hospitalId,
      },
    });

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);

    return res.status(500).json({
      message: "Unable to create room",
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;

    const rooms = await prisma.room.findMany({
      where: {
        hospitalId,
        isActive: true,
      },
      include: {
        currentDoctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            queueEntries: {
              where: {
                status: {
                  in: ["WAITING", "CALLED", "IN_CONSULTATION"],
                },
              },
            },
          },
        },
      },
      orderBy: {
        roomNumber: "asc",
      },
    });

    return res.status(200).json({
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);

    return res.status(500).json({
      message: "Unable to load rooms",
    });
  }
};

const assignDoctorToRoom = async (req, res) => {
  try {
    const roomId = Number(req.params.id);
    const doctorId = Number(req.body.doctorId);
    const hospitalId = req.user.hospitalId;

    if (!roomId || !doctorId) {
      return res.status(400).json({
        message: "Valid room ID and doctor ID are required",
      });
    }

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        hospitalId,
        isActive: true,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const doctor = await prisma.user.findFirst({
      where: {
        id: doctorId,
        hospitalId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found in your hospital",
      });
    }

    await prisma.room.updateMany({
      where: {
        hospitalId,
        currentDoctorId: doctorId,
      },
      data: {
        currentDoctorId: null,
      },
    });

    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        currentDoctorId: doctorId,
      },
      include: {
        currentDoctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Doctor assigned successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Assign doctor error:", error);

    return res.status(500).json({
      message: "Unable to assign doctor",
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  assignDoctorToRoom,
};