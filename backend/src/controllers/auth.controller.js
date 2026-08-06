const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");

exports.registerHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      hospitalEmail,
      phone,
      address,
      adminName,
      adminEmail,
      password,
    } = req.body;

    if (
      !hospitalName ||
      !hospitalEmail ||
      !adminName ||
      !adminEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Required details are missing",
      });
    }

    const existingHospital =
      await prisma.hospital.findUnique({
        where: {
          email: hospitalEmail,
        },
      });

    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital email already registered",
      });
    }

    const existingAdmin =
      await prisma.user.findUnique({
        where: {
          email: adminEmail,
        },
      });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin email already registered",
      });
    }

    const code =
      hospitalName
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 6) +
      Math.floor(1000 + Math.random() * 9000);

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(
      async (tx) => {
        const hospital = await tx.hospital.create({
          data: {
            name: hospitalName.trim(),
            email: hospitalEmail.trim(),
            phone: phone?.trim() || null,
            address: address?.trim() || null,
            code,
          },
        });

        const admin = await tx.user.create({
          data: {
            name: adminName.trim(),
            email: adminEmail.trim(),
            password: hashedPassword,
            role: "ADMIN",
            hospitalId: hospital.id,
          },
        });

        return {
          hospital,
          admin,
        };
      }
    );

    return res.status(201).json({
      success: true,
      message: "Hospital registered successfully",
      hospital: {
        id: result.hospital.id,
        name: result.hospital.name,
        code: result.hospital.code,
      },
      admin: {
        id: result.admin.id,
        name: result.admin.name,
        email: result.admin.email,
        role: result.admin.role,
      },
    });
  } catch (error) {
    console.error("Hospital registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to register hospital",
      error: error.message,
    });
  }
};

exports.registerStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      hospitalCode,
      phone,
      specialization,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !hospitalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required details are missing",
      });
    }

    if (
      role !== "DOCTOR" &&
      role !== "RECEPTIONIST"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be DOCTOR or RECEPTIONIST",
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hospital =
      await prisma.hospital.findUnique({
        where: {
          code: hospitalCode.trim().toUpperCase(),
        },
      });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Invalid hospital code",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        role,
        phone: phone?.trim() || null,
        specialization:
          role === "DOCTOR"
            ? specialization?.trim() || null
            : null,
        hospitalId: hospital.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Staff registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospitalId: user.hospitalId,
      },
      hospital: {
        id: hospital.id,
        name: hospital.name,
        code: hospital.code,
      },
    });
  } catch (error) {
    console.error("Staff registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to register staff",
      error: error.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      hospitalId,
      phone,
      specialization
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hospital = await prisma.hospital.findUnique({
      where: {
        id: Number(hospitalId)
      }
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        specialization,
        hospitalId: Number(hospitalId)
      }
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
  {
    userId: user.id,
    role: user.role,
    hospitalId: user.hospitalId,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    res.json({
      success: true,
      token,
      user
    });

  } catch (error) {

    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};