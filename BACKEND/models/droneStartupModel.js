// droneStartupModel.js
// WHAT:
// Assignment of a website user to a selected drone.
//
// WHY:
// Tracks which user is using which drone when they start a session.
//
// HOW:
// Stores userId and the drone they selected. One active assignment per user.

import mongoose from "mongoose";

const droneStartupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    droneId: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["assigned", "started", "disconnected"],
      default: "assigned",
    },
  },
  { timestamps: true }
);

const DroneStartup =
  mongoose.models.DroneStartup ||
  mongoose.model("DroneStartup", droneStartupSchema);

export default DroneStartup;
