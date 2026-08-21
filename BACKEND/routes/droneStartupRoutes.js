// droneStartupRoutes.js
// WHAT:
// Drone startup API routes.
//
// WHY:
// Keeps HTTP endpoints separate from drone control logic.
//
// HOW:
// Routes call controllers which create users and assign them to drones.

import express from "express";
import {
  createUserController,
  startupDroneController,
} from "../controllers/droneStartupController.js";

const router = express.Router();

// POST
// /api/web/drone/user
//
// Assigns a user id to a website visitor
router.post("/user", createUserController);

// POST
// /api/web/drone/startup
//
// Assigns a user to a selected drone
router.post("/startup", startupDroneController);

export default router;
