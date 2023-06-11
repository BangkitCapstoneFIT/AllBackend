import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { db } from "../config/firebase";

interface Place {
  id: string;
  place: string;
}

export const searchedByUser = async (req: Request, res: Response) => {
  try {
    // Extract the required data from the request body
    const { place, userId } = req.body;

    // Generate a unique ID for the subcollection document using nanoid
    const id = nanoid();

    // Create a new place object with the generated ID
    const newPlace: Place = {
      id,
      place,
    };

    // Reference the parent collection document

    const userRef = db.collection("databaseUser").doc(id);


    // Create the subcollection reference within the parent document
    const subcollectionRef = userRef.collection("databaseSearchedByUser");

    // Store the place data in the subcollection
    await subcollectionRef.doc(id).set(newPlace);

    // Return a response indicating success
    res.json({ message: "Place registered successfully" });
  } catch (error) {
    console.log(error);
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to register place" });
  }

};

