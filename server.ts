import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as admin from 'firebase-admin';

const serviceAccount = require('./firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const usersRef = db.collection('userLogin');
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// Define your routes here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
app.post('/register', (req, res) => {
  // Extract the required data from the request body
  const { email, username, password, phoneNumber } = req.body;

  // Here, you can implement the logic to store the user data in Firebase Firestore

  // Return a response indicating success or failure
  res.json({ message: 'User registered successfully' });
});
