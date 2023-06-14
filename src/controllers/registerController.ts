import { db } from "../config/firebase";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    const { email, username, password, phoneNumber, fullname, profileImage } = req.body;

    // Check if all required fields are present
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required", userRegistered: [] });
    }

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required", userRegistered: [] });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required", userRegistered: [] });
    }

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required", userRegistered: [] });
    }

    if (!fullname) {
      return res.status(400).json({ success: false, message: "Full name is required", userRegistered: [] });
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format", userRegistered: [] });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password should be at least 6 characters long", userRegistered: [] });
    }

    // Check if the email is already registered
    const existingUser = await db.collection("databaseUsers").where("email", "==", email).limit(1).get();
    if (!existingUser.empty) {
      return res.status(400).json({ success: false, message: "Email is already registered", userRegistered: [] });
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
      fullname,
      profileImage,
    };

    // Store the user data in Firebase Firestore
    await db.collection("databaseUsers").doc(id).set(newUser);

    let snapshot = await db
      .collection("databaseUsers")
      .where("username", "==", username)
      .limit(1)
      .get();
      const user = snapshot.docs[0].data();
      res.json({
            success: true,
            message: "Register successful",
            userRegistered: [{
              id: user.id,
              email: user.email,
              username: user.username,
              password: user.password,
              phoneNumber: user.phoneNumber,
              fullname: user.fullname,
              profileImage: user.profileImage
            }],
          });
  } catch (error) {
    console.log(error);
    // Return a response indicating failure
    res.status(500).json({ success: false, message: "Failed to register user", userRegistered: [] });
  }
};