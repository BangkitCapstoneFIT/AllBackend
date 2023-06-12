import express from "express";
import { getAllWisata} from "../controllers/getallwisataController";

const router = express.Router();

router.get("/", getAllWisata);

export default router;
