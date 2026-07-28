const prisma = require("../config/prisma");
const { getIO } = require("../sockets/socket");

exports.addPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      address,
      gender,
      issue,
      roomId,
    } = req.body;

    if (!name || !phone || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and room ID are required",
      });
    }

    const cleanRoomId = Number(roomId);
    const hospitalId = Number(req.user.hospitalId);

    if (!Number.isInteger(cleanRoomId) || cleanRoomId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid room ID is required",
      });
    }

    const room = await prisma.room.findFirst({
      where: {
        id: cleanRoomId,
        hospitalId,
        isActive: true,
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found in your hospital",
      });
    }

    const lastQueueEntry = await prisma.queueEntry.findFirst({
      where: {
        roomId: cleanRoomId,
      },
      orderBy: {
        tokenNumber: "desc",
      },
    });

    const tokenNumber = lastQueueEntry
      ? lastQueueEntry.tokenNumber + 1
      : 1;

    const result = await prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          name: name.trim(),
          age: age ? Number(age) : null,
          phone: phone.trim(),
          address: address?.trim() || null,
          gender: gender?.trim() || null,
          hospitalId,
        },
      });

      const queueEntry = await tx.queueEntry.create({
        data: {
          tokenNumber,
          issue: issue?.trim() || null,
          status: "WAITING",
          patientId: patient.id,
          roomId: cleanRoomId,
        },
        include: {
          patient: true,
          room: {
            include: {
              currentDoctor: {
                select: {
                  id: true,
                  name: true,
                  specialization: true,
                },
              },
            },
          },
        },
      });

      return {
        patient,
        queueEntry,
      };
    });

    getIO()
      .to(String(cleanRoomId))
      .emit("patient-added", result.queueEntry);

    return res.status(201).json({
      success: true,
      message: "Patient added to queue successfully",
      patient: result.patient,
      queueEntry: result.queueEntry,
    });
  } catch (error) {
    console.error("Add patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add patient",
      error: error.message,
    });
  }
};

exports.getQueue = async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const hospitalId = Number(req.user.hospitalId);

    if (!Number.isInteger(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Valid room ID is required",
      });
    }

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        hospitalId,
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const queue = await prisma.queueEntry.findMany({
      where: {
        roomId,
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
      success: true,
      message: "Queue fetched successfully",
      queue,
    });
  } catch (error) {
    console.error("Get queue error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch queue",
      error: error.message,
    });
  }
};

exports.callNext = async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const hospitalId = Number(req.user.hospitalId);

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        hospitalId,
      },
      include: {
        currentDoctor: true,
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (!room.currentDoctorId) {
      return res.status(400).json({
        success: false,
        message: "No doctor is assigned to this room",
      });
    }

    const activePatient = await prisma.queueEntry.findFirst({
      where: {
        roomId,
        status: {
          in: ["CALLED", "IN_CONSULTATION"],
        },
      },
    });

    if (activePatient) {
      return res.status(400).json({
        success: false,
        message: "Complete the current consultation first",
      });
    }

    const nextQueueEntry = await prisma.queueEntry.findFirst({
      where: {
        roomId,
        status: "WAITING",
      },
      orderBy: {
        tokenNumber: "asc",
      },
      include: {
        patient: true,
      },
    });

    if (!nextQueueEntry) {
      return res.status(404).json({
        success: false,
        message: "No waiting patient found",
      });
    }

    const updatedQueueEntry = await prisma.queueEntry.update({
      where: {
        id: nextQueueEntry.id,
      },
      data: {
        status: "CALLED",
        calledAt: new Date(),
      },
      include: {
        patient: true,
      },
    });

    console.log(
      `SMS to ${updatedQueueEntry.patient.phone}: Please enter room ${room.roomNumber}. Your token number is ${updatedQueueEntry.tokenNumber}.`
    );

    getIO()
      .to(String(roomId))
      .emit("patient-called", updatedQueueEntry);

    return res.status(200).json({
      success: true,
      message: "Patient called successfully",
      queueEntry: updatedQueueEntry,
    });
  } catch (error) {
    console.error("Call next error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to call next patient",
      error: error.message,
    });
  }
};

exports.startConsultation = async (req, res) => {
  try {
    const queueEntryId = req.params.queueEntryId;
    const doctorId = Number(req.user.userId || req.user.id);

    const queueEntry = await prisma.queueEntry.findUnique({
      where: {
        id: queueEntryId,
      },
      include: {
        room: true,
        patient: true,
      },
    });

    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        message: "Queue entry not found",
      });
    }

    if (queueEntry.room.currentDoctorId !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this room",
      });
    }

    if (queueEntry.status !== "CALLED") {
      return res.status(400).json({
        success: false,
        message: "Only a called patient can start consultation",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedQueueEntry = await tx.queueEntry.update({
        where: {
          id: queueEntryId,
        },
        data: {
          status: "IN_CONSULTATION",
          startedAt: new Date(),
        },
        include: {
          patient: true,
        },
      });

      const consultationLog = await tx.consultationLog.create({
        data: {
          patientId: queueEntry.patientId,
          doctorId,
          queueEntryId,
          startedAt: new Date(),
        },
      });

      return {
        updatedQueueEntry,
        consultationLog,
      };
    });

    getIO()
      .to(String(queueEntry.roomId))
      .emit("consultation-started", result.updatedQueueEntry);

    return res.status(200).json({
      success: true,
      message: "Consultation started successfully",
      ...result,
    });
  } catch (error) {
    console.error("Start consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start consultation",
      error: error.message,
    });
  }
};

exports.completePatient = async (req, res) => {
  try {
    const queueEntryId = req.params.queueEntryId;
    const doctorId = Number(req.user.userId || req.user.id);

    const queueEntry = await prisma.queueEntry.findUnique({
      where: {
        id: queueEntryId,
      },
      include: {
        room: true,
        consultationLog: true,
      },
    });

    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        message: "Queue entry not found",
      });
    }

    if (queueEntry.room.currentDoctorId !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this room",
      });
    }

    if (queueEntry.status !== "IN_CONSULTATION") {
      return res.status(400).json({
        success: false,
        message: "Only an active consultation can be completed",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedQueueEntry = await tx.queueEntry.update({
        where: {
          id: queueEntryId,
        },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
        include: {
          patient: true,
        },
      });

      let consultationLog = null;

      if (queueEntry.consultationLog) {
        consultationLog = await tx.consultationLog.update({
          where: {
            id: queueEntry.consultationLog.id,
          },
          data: {
            endedAt: new Date(),
          },
        });
      }

      return {
        updatedQueueEntry,
        consultationLog,
      };
    });

    getIO()
      .to(String(queueEntry.roomId))
      .emit("patient-completed", result.updatedQueueEntry);

    return res.status(200).json({
      success: true,
      message: "Consultation completed successfully",
      ...result,
    });
  } catch (error) {
    console.error("Complete consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to complete consultation",
      error: error.message,
    });
  }
};