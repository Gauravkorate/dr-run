const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join-room", "101");
});

socket.on("patient-added", (data) => {
  console.log("Patient Added:");
  console.log(data);
});

socket.on("patient-called", (data) => {
  console.log("Patient Called:");
  console.log(data);
});

socket.on("patient-completed", (data) => {
  console.log("Patient Completed:");
  console.log(data);
});