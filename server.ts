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

usersRef.get().then((querySnapshot) => {
  querySnapshot.forEach((document) => {
    console.log(document.data());
  });
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    // Extract the required data from the request body
    const { email, username, password, phoneNumber } = req.body;

    // Check if all required fields are present
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    // Generate a unique ID using nanoid
    const id = nanoid();

    // Create a new user object with the generated ID
    const newUser = {
      id,
      email,
      username,
      password,
      phoneNumber,
    };

    // Store the user data in Firebase Firestore
    await usersRef.doc(id).set(newUser);

    // Return a response indicating success
    res.json({ message: "User registered successfully" });
  } catch (error) {
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Endpoint to get data from Firestore
app.get("/data", (req, res) => {
  const collectionRef = db.collection("databaseDataRaw");

  collectionRef
    .get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        const { target, texts } = doc.data();
        data.push({ target, texts });
      });
      res.json(data);
    })
    .catch((error) => {
      console.error("Error getting data from Firestore:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
