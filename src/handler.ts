import { Request, Response } from "express";
import { nanoid } from "nanoid";
import * as admin from "firebase-admin";

const db = admin.firestore();
const usersRef = db.collection("databaseUser");

export const registerHandler = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    console.log(req.body);
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
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    const { usernameOrEmail, password } = req.body;

    // Check if all required fields are present
    if (!usernameOrEmail) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find a user with the provided username or email
    let snapshot = await usersRef
      .where("username", "==", usernameOrEmail)
      .limit(1)
      .get();

    // If no user is found with the username, try finding by email
    if (snapshot.empty) {
      const snapshotByEmail = await usersRef
        .where("email", "==", usernameOrEmail)
        .limit(1)
        .get();

      if (snapshotByEmail.empty) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Use the user found by email
      snapshot = snapshotByEmail;
    }

    // Get the user data from the snapshot
    const user = snapshot.docs[0].data();

    // Check if the provided password matches the user's password
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return a response indicating successful login
    res.json({ message: "Login successful", user });
  } catch (error) {
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to login" });
  }
};

export const getDataHandler = (req: Request, res: Response) => {
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
};
