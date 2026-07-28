const prisma = require("../config/prisma");

const getStartOfToday = () => {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
};

const addPatientToQueue = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      address,
      issue,
      roomId,
    } = req.body;

    const hospitalId = req.user.hospitalId;
    const parsedRoomId = Number(roomId);

    if (
      !name ||
      !age ||
      !phone ||
      !issue ||
      !parsedRoomId
    ) {
      return res.status(400).json({
        message:
          "Name, age, phone, issue and room are required",
      });
    }

    const room = await prisma.room.findFirst({
      where: {
        id: parsedRoomId,
        hospitalId,
        isActive: true,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found in your hospital",
      });
    }

    const startOfToday = getStartOfToday();

    const queueEntry = await prisma.$transaction(
      async (tx) => {
        const patient = await tx.patient.create({
          data: {
            name: name.trim(),
            age: Number(age),
            phone: String(phone).trim(),
            address: address?.trim() || null,
            hospitalId,
          },
        });

        const lastQueueEntry =
          await tx.queueEntry.findFirst({
            where: {
              roomId: parsedRoomId,
              registeredAt: {
                gte: startOfToday,
              },
            },
            orderBy: {
              tokenNumber: "desc",
            },
          });

        const tokenNumber = lastQueueEntry
          ? lastQueueEntry.tokenNumber + 1
          : 1;

        return tx.queueEntry.create({
          data: {
            patientId: patient.id,
            roomId: parsedRoomId,
            tokenNumber,
            issue: issue.trim(),
          },
          include: {
            patient: true,
            room: true,
          },
        });
      }
    );

    const io = req.app.get("io");

    if (io) {
      io.to(`room:${queueEntry.roomId}`).emit(
        "patient-added",
        queueEntry
      );
    }

    return res.status(201).json({
      message: "Patient added to queue successfully",
      queueEntry,
    });
  } catch (error) {
    console.error("Add patient error:", error);

    return res.status(500).json({
      message: "Unable to add patient to queue",
    });
  }
};

const getQueueByRoom = async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const hospitalId = req.user.hospitalId;

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        hospitalId,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const queue = await prisma.queueEntry.findMany({
      where: {
        roomId,
        status: {
          in: ["WAITING", "CALLED", "IN_PROGRESS"],
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
    console.error("Get room queue error:", error);

    return res.status(500).json({
      message: "Unable to load queue",
    });
  }
};

module.exports = {
  addPatientToQueue,
  getQueueByRoom,
};