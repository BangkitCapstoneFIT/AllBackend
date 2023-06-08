import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { nanoid } from "nanoid";
import * as admin from "firebase-admin";
import "dotenv/config";

const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const usersRef = db.collection("databaseUser");
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});