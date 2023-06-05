var admin = require("firebase-admin");
var serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const data = {
    email: "test@gmail.com",
    id: 2,
    password: "testpassword",
    phone: "081234567890",
    username: "test"
}

db.collection("databaseUser").doc(data.id.toString()).set(data);
