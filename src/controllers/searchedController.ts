import { db } from "../config/firebase";
import { Request, Response } from "express";
import * as admin from "firebase-admin";

export const searchedByUser = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    const { place } = req.body;

    // Post data to Firestore
    try {
      await db.collection("searchedPlaces").add({ place });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    // Return a response indicating success
    res.json({ message: "Data posted to Firestore successfully" });
  } catch (error) {
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to post data to Firestore" });
  }
};