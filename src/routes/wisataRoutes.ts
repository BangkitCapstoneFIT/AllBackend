import express from "express";
import { getAllWisata, searchedByUser } from "../controllers/getallwisataController";

const router = express.Router();

router.get("/", getAllWisata);
//router.post("/", searchedByUser);

export default router;
