// userModel.js
// WHAT:
// Website user identity.
//
// WHY:
// Every visitor gets a stable user id so they can be assigned to a drone.
//
// HOW:
// MongoDB _id is the assigned user id. A document is created on first use.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    assignedDroneId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
