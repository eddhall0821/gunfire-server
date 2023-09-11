import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.listen(3001);

const characters = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};
io.on("connection", (socket) => {
  console.log("user connected");
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
  });

  socket.emit("hello");
  socket.on("move", (position) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    character.position = position;
    io.emit("characters", characters);
  });

  io.emit("characters", characters);

  socket.on("disconnect", () => {
    console.log("disconncted");
    characters.splice(
      characters.findIndex((character) => character.id === socket.id)
    );
  });
});
