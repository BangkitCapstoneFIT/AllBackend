import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

# Initialize Firebase Admin SDK
cred = credentials.Certificate("./src/firebase.json")  # Replace with your service account key path
firebase_admin.initialize_app(cred)

# Create a Firestore client
db = firestore.client()

# Specify the reference path
ref_path = "databaseDataRaw"  # Replace with the desired reference path

# Read the data from JSON file
with open("./dataraw.json", encoding="utf8") as json_file:  # Replace with the actual path to your JSON file
    data = json.load(json_file)

# Upload each data entry to Firestore
for entry in data:
    doc_ref = db.collection(ref_path).document()
    doc_ref.set(entry)

print("Data uploaded successfully.")
