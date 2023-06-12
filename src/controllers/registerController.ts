import { db } from "../config/firebase";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

export const registerUser = async (req: Request, res: Response) => {
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
    await db.collection("databaseUser").doc(id).set(newUser);

    // Return a response indicating success
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to register user" });
  }
};
