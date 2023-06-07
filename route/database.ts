import { nanoid } from "nanoid";
import * as admin from "firebase-admin";
const db = admin.firestore();
const usersRef = db.collection("databaseUser");
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const collectionRef = db.collection('databaseDataRaw');
  
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
        console.error('Error getting data from Firestore:', error);
        res.status(500).send('Internal Server Error');
      });
  });

  module.exports = router;