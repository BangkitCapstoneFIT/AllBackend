import { db } from "../config/firebase";
import { Request, Response } from "express";
import * as admin from "firebase-admin";

export const searchedByUser = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    const { place } = req.body;

    // Check if the place already exists
    const querySnapshot = await db
      .collection("searchedPlaces")
      .where("place", "==", place)
      .get();

    if (!querySnapshot.empty) {
      // Place already exists, return a response indicating it's a duplicate
      return res.status(400).json({ message: "Place already exists" });
    }

    // Add the place to Firestore
    try {
      const docRef = await db.collection("searchedPlaces").add({ place });

      // Return a response indicating success
      res.json({ message: "Data posted to Firestore successfully", docId: docRef.id });
    } catch (error) {
      console.error("Error adding document: ", error);
      // Return a response indicating failure
      res.status(500).json({ message: "Failed to post data to Firestore" });
    }
  } catch (error) {
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to post data to Firestore" });
  }
};