// server.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/mongoDB.js";
import droneStartupRoutes from "./routes/droneStartupRoutes.js";

dotenv.config();

const app = express();

const port = Number(process.env.PORT) || 4020;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Drone routes
app.use("/api/web/drone", droneStartupRoutes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log("Connected to MongoDB");
      console.log("Server is running on port", port);
      console.log(`Tello API listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
  }
};

startServer();
