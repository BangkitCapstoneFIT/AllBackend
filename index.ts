import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { nanoid } from 'nanoid';
import * as admin from 'firebase-admin';
import 'dotenv/config'

//connect coding ke database
const serviceAccount = require('./firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//biar bs melakukan sesuatu di database
const db = admin.firestore();
const app = express();
const usersRef = db.collection("databaseDataRaw");
const PORT = process.env.PORT;

//ambil document (firebase)
usersRef.get().then((querySnapshot) => {
  querySnapshot.forEach((document) => {
    console.log(document.data());
    })
})

//bantu coding
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Endpoint to get data from Firestore
app.get('/data', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});