// socketHandler.ts
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket);
    io.emit("message", message);
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
module.exports = socketHandler;
