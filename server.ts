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
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.post('/register', async (req, res) => {
  try {
    // Extract the required data from the request body
    const { email, username, password, phoneNumber } = req.body;

    // Create a new user object
    const newUser = {
      email,
      username,
      password,
      phoneNumber,
    };

    // Store the user data in Firebase Firestore
    await usersRef.add(newUser);

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
