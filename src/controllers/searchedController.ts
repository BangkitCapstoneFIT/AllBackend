import { db } from "../config/firebase";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

export const searchedByUser = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    const { place } = req.body;

    const id = nanoid();

    // Create a new user object with the generated ID
    const newPlace = {
      id,
      place,
    };

    // Store the user data in Firebase Firestore
    await db.collection("databaseSearchedByUser").doc(id).set(newPlace);

    // Return a response indicating success
    res.json({ message: "Data posted to Firestore successfully" });
  } catch (error) {
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to post data to Firestore" });
  }
};