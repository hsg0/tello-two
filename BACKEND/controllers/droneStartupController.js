// droneStartupController.js
// WHAT:
// Controller for website users and drone assignment.
//
// WHY:
// Assigns a user id to each website visitor, then links that user to a selected drone.
//
// HOW:
// Creates or looks up a user, then upserts their drone assignment.

import User from "../models/userModel.js";
import DroneStartup from "../models/droneStartupModel.js";

const createUserController = async (req, res) => {
  try {
    const user = await User.create({});

    return res.status(201).json({
      message: "User id assigned",
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to assign user id",
      error: error.message,
    });
  }
};

const startupDroneController = async (req, res) => {
  try {
    const { userId, droneId } = req.body;

    if (!droneId) {
      return res.status(400).json({ message: "droneId is required" });
    }

    let user;

    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      user = await User.create({});
    }

    user.assignedDroneId = droneId;
    await user.save();

    const assignment = await DroneStartup.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        droneId,
        status: "assigned",
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "User assigned to drone",
      userId: user._id,
      drone: assignment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to assign user to drone",
      error: error.message,
    });
  }
};

export { createUserController, startupDroneController };
