import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { nanoid } from 'nanoid';
import * as admin from 'firebase-admin';

const serviceAccount = require('./firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const usersRef = db.collection("databaseUser");
const PORT = process.env.PORT;

usersRef.get().then((querySnapshot) => {
  querySnapshot.forEach((document) => {
    console.log(document.data());
    })
})

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.post('/register', async (req, res) => {
  try {
    // Extract the required data from the request body
    const { email, username, password, phoneNumber } = req.body;

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
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    // Return a response indicating failure
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
