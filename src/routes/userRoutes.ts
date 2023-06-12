import express, { Request, Response } from "express";
import { registerUser } from "../controllers/registerController";
import { loginUser } from "../controllers/loginController";
import { searchedByUser } from "../controllers/getallwisataController";

const router = express.Router();

router.post("/search", searchedByUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
