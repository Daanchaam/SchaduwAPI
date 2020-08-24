import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import http from "http";
import socketio from "socket.io";

require("dotenv").config();
// Middleware
import auth from "./middleware/auth";
import hasRole from "./middleware/role";

// Express setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "../client/public")));
app.use(express.json());
app.use(cors());

// The whole socket.io business
io.on("connection", function (socket) {
  console.log("Client connected.");

  socket.emit("change color", "hoi");

  // Disconnect listener
  socket.on("disconnect", function () {
    console.log("Client disconnected.");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

// Mongoose setup
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (error: any) => {
    if (error) throw error;
    console.log("MongoDB connection established");
  }
);

// Route setup
app.use("/api/user", require("./routes/userRouter"));
app.use(
  "/api/match",
  auth,
  hasRole("admin", "referee"),
  require("./routes/matchRouter")
);
