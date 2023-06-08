import express from "express";
import { registerHandler, loginHandler, getDataHandler } from "./handler";

const router = express.Router();

// Register route
router.post("/register", registerHandler);

// Login route
router.post("/login", loginHandler);

// Get data route
router.get("/data", getDataHandler);

export default router;
