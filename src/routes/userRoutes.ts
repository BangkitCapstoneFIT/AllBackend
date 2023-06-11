import express, { Request, Response } from "express";
import { registerUser } from "../controllers/registerController";
import { loginUser } from "../controllers/loginController";
import { searchedByUser } from "../controllers/searchedController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/searched", searchedByUser);

export default router;
