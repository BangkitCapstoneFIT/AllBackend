# FIT Backend (Find Indonesian Tourism)

REST API and Firestore database for **FIT**, a mobile app that helps travellers discover tourist destinations across Indonesia's islands. Built for the Bangkit Academy 2023 capstone (led by Google, Tokopedia, Gojek and Traveloka) by the team's Cloud Engineer.

**Stack:** Node.js, Express, TypeScript, Firebase Admin SDK (Cloud Firestore), JWT, Google Places API, Python (data loader), Docker, Google Cloud.

## Architecture

```
Mobile app ──HTTP──▶ Express API (TypeScript, Docker on Google Cloud)
                        │
                        ├──▶ Cloud Firestore
                        │      databaseUsers/{id}                 user accounts
                        │      databaseUsers/{id}/databaseSearched search history
                        │      databasePulauIndonesia             island list
                        │      databaseDataRaw                    labelled review texts
                        │
                        └──▶ Google Places API (text search, place details, photos)

upload.py ──▶ seeds databaseDataRaw from dataraw.json (2,867 labelled review texts)
```

## Endpoints

All routes return JSON. Routes marked 🔒 need `Authorization: Bearer <token>` from `/users/login`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/users/register` | Create an account (`email`, `username`, `password`, `phoneNumber`, `fullname`, optional `profileImage`) |
| POST | `/users/login` | Log in with `usernameOrEmail` + `password`, returns a JWT |
| POST | `/users/update` 🔒 | Update profile fields |
| POST | `/users/search` 🔒 | Save a searched `place` to the user's search history |
| GET | `/users/get?query=` | Search destinations (Google Places text search) |
| GET | `/users/overview?placeId=` | Short editorial summary of a place |
| GET | `/users/location/:island` | Tourist spots on a given island |
| GET | `/users/list?page=` | Indonesian islands stored in Firestore |
| GET | `/users/popular?location=` | Popular attractions with photo URL and rating |
| GET | `/data?page=` | Labelled review texts (`target`, `texts`) used by the ML team |

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Firebase service account key (Firebase console → Project settings → Service accounts) and save it as `src/config/serviceAccount.json`. It is git-ignored; never commit it.
3. Create a `.env` file (also git-ignored):
   ```env
   PORT=8080
   JWT_SECRET=any-long-random-string
   API_KEY=your-google-maps-places-api-key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### With Docker

```bash
docker build -t fit-backend .
docker run -p 8080:80 -e PORT=80 --env-file .env fit-backend
```

### Seed the review dataset

```bash
pip install firebase-admin
python upload.py
```

`upload.py` reads `dataraw.json` (2,867 review texts labelled with a sentiment `target`) and writes each entry to the `databaseDataRaw` collection. It expects the service account key at `./firebase.json`. It checks a `unique_id` field to skip duplicates, but the current dataset has no such field, so run it only once (or add IDs first).

## What I would improve today

- Hash passwords (for example with bcrypt) instead of storing them as plain text, and stop returning them in API responses.
- Replace `offset(page - 1)` with real page-size pagination (`limit` + cursor).
- Move the Docker base image from Node 14 to a supported LTS and compile TypeScript instead of running `ts-node` in production.
- Give every dataset record a stable ID so the loader is truly idempotent.
- Add input validation and tests.
