import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import AthleteDashboard from "./pages/AthleteDashboard";
import AttendanceManagement from "./pages/AttendanceManagement";
import CaptainDashboard from "./pages/CaptainDashboard";
import CoachAttendance from "./pages/CoachAttendance";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/athlete" element={<ProtectedRoute roles={["athlete"]}><AthleteDashboard /></ProtectedRoute>} />
          <Route path="/captain" element={<ProtectedRoute roles={["captain"]}><CaptainDashboard /></ProtectedRoute>} />
          <Route path="/coach-attendance" element={<ProtectedRoute roles={["captain", "admin"]}><CoachAttendance /></ProtectedRoute>} />
          <Route path="/alumni" element={<ProtectedRoute roles={["alumni"]}><AlumniDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute roles={["captain", "admin"]}><AttendanceManagement /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute roles={["captain", "admin"]}><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
