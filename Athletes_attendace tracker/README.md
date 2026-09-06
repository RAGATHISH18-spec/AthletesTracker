# Athletics Attendance Tracker

A full-stack athletics attendance tracker for college and professional training teams. It supports athlete, captain, alumni, and admin workflows with Firebase Authentication, Firestore, Express APIs, charts, role-based pages, reports, and responsive dark/light UI.

## Tech Stack

- Frontend: React, Tailwind CSS, Context API, Recharts
- Backend: Node.js, Express
- Database/Auth: Firebase Firestore and Firebase Authentication
- Reports: CSV export from the UI, API-ready report endpoints
- Hosting: Firebase Hosting or Vercel

## Project Structure

```text
client/       React app
server/       Express API
firebase/     Firestore rules and indexes
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment files:

```bash
copy client\.env.example client\.env.local
copy server\.env.example server\.env
```

3. Add Firebase web config values to `client/.env.local`.

4. Add Firebase Admin credentials to `server/.env`.

5. Run the app:

```bash
npm run dev
```

The React app runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Demo Mode

If Firebase web keys are not set, the client runs in demo mode with sample users:

- `athlete@track.edu`
- `captain@track.edu`
- `alumni@track.edu`
- `admin@track.edu`

Any password with at least 6 characters works in demo mode.

## Firebase Deployment

Deploy rules:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Build and deploy hosting:

```bash
npm --prefix client run build
firebase deploy --only hosting
```

For Vercel, set the client environment variables in the Vercel dashboard and use `client` as the project root.
