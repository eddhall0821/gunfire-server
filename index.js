import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config({ path: ".env" });
const io = new Server({
  cors: {
    origin: [
      process.env.DB_CLIENT,
      "https://eddhall0821.github.io/gunfire-client",
    ],
  },
});

io.listen(80);

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
