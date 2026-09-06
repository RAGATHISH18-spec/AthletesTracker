# 🏃‍♂️ Athletics Attendance Tracker

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.1-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A modern sports attendance and training management web application designed for collegiate and athletic squads. It streamlines daily morning and evening practice check-ins, tracks athlete performance trends with interactive charts, provides role-based access for athletes, captains, coaches, and alumni, and enables 1-click CSV data export for institutional reporting.

---

## 🌟 Features

- **⚡ Dual-Session Attendance Logging**: Record practice sessions for both **Morning (AM)** and **Evening (PM)** with status tags: `Present`, `Late`, or `Absent`.
- **🛡️ Role-Based Access Control (RBAC)**: Tailored dashboards and permissions for **Athletes**, **Captains**, **Coaches/Admins**, and **Alumni**.
- **📊 Real-Time Analytics & Charts**: Interactive weekly attendance patterns, session summaries, and squad health statistics powered by [Recharts](https://recharts.org/).
- **💾 Offline Support & Pitch-Side Reliability**: Firestore IndexedDB persistence enables the app to operate smoothly even with spotty field or stadium connectivity.
- **📁 One-Click CSV Export**: Instant generation and download of filtered attendance records (`attendance_YYYY-MM-DD.csv`) for departmental audits and coach records.
- **🔍 Department & 7-Day Window Filtering**: Easily audit athlete participation across academic departments (CSE, IT, ECE, Mech, Civil) over 7-day rolling windows.
- **🌓 Adaptive Theming**: Full Light and Dark mode with sports-inspired gold and crimson accents.
- **🧪 Zero-Config Demo Mode**: Out-of-the-box demo environment pre-loaded with mock athletes, sessions, and roles—no external database keys required to test.

---

## 👥 User Roles & Permissions

| Role | Target Route | Core Capabilities |
| :--- | :--- | :--- |
| **Athlete** | `/athlete` | View personal attendance percentage, training schedule, upcoming events, and personal check-in history. |
| **Captain** | `/captain`, `/attendance` | Mark morning/evening attendance for team members, view team statistics, filter by department, and export CSV reports. |
| **Coach / Admin** | `/admin`, `/coach-attendance`, `/reports` | Squad-wide oversight, manage user accounts & roles, verify coach attendance, generate custom date/week/month reports. |
| **Alumni** | `/alumni` | Access team legacy metrics, upcoming meets, and alumni engagement updates. |

---

## 🚀 Quick Start (Demo Mode)

You can explore the complete application immediately without setting up Firebase credentials:

### 1. Clone the repository
```bash
git clone https://github.com/RAGATHISH18-spec/AthletesTracker.git
cd AthletesTracker/"Athletes_attendace tracker"/client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### 🔑 Demo Accounts

Use any of the following accounts with any password having **at least 6 characters** (e.g., `training123`):

| Role | Demo Email | Password |
| :--- | :--- | :--- |
| **Captain** | `captain@track.edu` | `training123` |
| **Athlete** | `athlete@track.edu` | `training123` |
| **Admin / Coach**| `admin@track.edu` | `training123` |
| **Alumni** | `alumni@track.edu` | `training123` |

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Backend & Auth**: [Firebase v11](https://firebase.google.com/) (Authentication + Cloud Firestore)
- **Local Database & Cache**: Browser IndexedDB offline caching

---

## 📂 Project Structure

```text
AthletesTracker/
├── Athletes_attendace tracker/
│   ├── client/                      # Frontend Single Page Application
│   │   ├── public/                  # Static assets (logos, event banners)
│   │   ├── src/
│   │   │   ├── components/          # Reusable UI components
│   │   │   │   ├── charts/          # Recharts attendance graphs
│   │   │   │   ├── layout/          # AppLayout, Header, Sidebar, MobileNav
│   │   │   │   └── ui/              # StatCards, StatusBadges, Buttons
│   │   │   ├── context/             # AuthContext and ThemeContext
│   │   │   ├── data/                # Mock data fixtures for Demo Mode
│   │   │   ├── hooks/               # Custom data-fetching hooks (useTrackerData)
│   │   │   ├── pages/               # Role-specific dashboard views & auth pages
│   │   │   ├── services/            # FirebaseStore & DemoStore data abstraction
│   │   │   ├── utils/               # Attendance calculation & CSV export utilities
│   │   │   ├── App.jsx              # Application router and protected routes
│   │   │   ├── firebase.js          # Firebase SDK initialization & offline config
│   │   │   └── main.jsx             # React DOM entrypoint
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── vite.config.js
│   ├── firebase/                    # Security configurations
│   │   ├── firestore.rules          # Granular role-based Firestore rules
│   │   └── firestore.indexes.json   # Composite index definitions
│   ├── firebase.json                # Firebase Hosting & deployment targets
│   ├── package.json                 # Top-level workspace script runner
│   └── CAPTAIN_DASHBOARD_TESTING.md # QA test checklist and validation suite
└── README.md
```

---

## ☁️ Production Firebase Setup

To connect the application to your own live Firebase project:

### 1. Configure Firebase Credentials
Open `client/src/firebase.js` and add your Firebase Project Web Configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Deploy Firestore Rules and Indexes
Ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and logged in:

```bash
cd "Athletes_attendace tracker"
firebase deploy --only firestore:rules,firestore:indexes
```

### 3. Deploy Frontend to Firebase Hosting
```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

---

## 🗄️ Firestore Data Schema

The database relies on security rules defined in `firebase/firestore.rules`:

- **`users`**: `{ name, email, role, department, year, event, phone, createdAt }`
- **`attendance`**: `{ athleteId, date, morning, evening, markedBy, timestamp }`
- **`coachAttendance`**: `{ date, status, markedBy, timestamp }`
- **`events` / `sports_events`**: `{ name, date, venue, category }`

---

## 🧪 Testing & Verification

For a comprehensive test plan covering UI interactions, captain 7-day windows, stat card verification, and CSV export format validation, refer to:
👉 [Captain Dashboard Testing Guide](file:///Athletes_attendace%20tracker/CAPTAIN_DASHBOARD_TESTING.md)

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.
