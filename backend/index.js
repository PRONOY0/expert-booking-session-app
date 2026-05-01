import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { dbConnect } from "./config/db.js";
import expertRoutes from "./routes/experRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config(); // move to top always

const app = express();
const httpServer = createServer(app); // wrap express with http server

const io = new Server(httpServer, {
  cors: {
    origin: "*", // change to frontend URL in production
    methods: ["GET", "POST", "PATCH"],
  },
});

const port = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());

// Attach io to app so controllers can access it via req.app.get("io")
app.set("io", io);

// Routes
app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Health check
app.get("/", (req, res) => {
  res.send(`Server is running at ${port}`);
});

dbConnect();

httpServer.listen(port, () => {
  console.log(`Server is running at ${port}`);
});