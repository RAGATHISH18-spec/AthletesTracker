import { Activity, CalendarCheck, ClipboardList, Home, Settings, Shield, User, UserCheck, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linksByRole = {
  athlete: [
    { to: "/athlete", icon: Home, label: "Dashboard" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ],
  captain: [
    { to: "/captain", icon: Home, label: "Dashboard" },
    { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
    { to: "/coach-attendance", icon: UserCheck, label: "Coach Attendance" },
    { to: "/reports", icon: ClipboardList, label: "Reports" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ],
  alumni: [
    { to: "/alumni", icon: Activity, label: "Team Members" },
    { to: "/profile", icon: User, label: "Profile" }
  ],
  admin: [
    { to: "/admin", icon: Shield, label: "Admin" },
    { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
    { to: "/coach-attendance", icon: UserCheck, label: "Coach Attendance" },
    { to: "/reports", icon: ClipboardList, label: "Reports" },
    { to: "/profile", icon: Users, label: "Users" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ]
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = linksByRole[user?.role] || [];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r-2 border-red-300 bg-gradient-to-br from-yellow-50 to-red-50 px-5 py-6 shadow-soft backdrop-blur dark:border-yellow-700 dark:bg-gradient-to-br dark:from-red-950 dark:to-red-900 lg:block" role="navigation" aria-label="Main navigation">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-track-lane text-white">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-track-lane">Athletics</p>
          <h1 className="text-lg font-bold text-red-950 dark:text-yellow-100">Attendance Tracker</h1>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-track-lane text-yellow-100 shadow-md"
                  : "text-red-700 hover:bg-yellow-100 dark:text-yellow-200 dark:hover:bg-red-900/50"
              }`
            }
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-5 right-5 rounded-lg border-2 border-red-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-red-900/40">
        <p className="text-xs font-semibold uppercase text-red-700 dark:text-yellow-300">Signed in as</p>
        <p className="mt-1 truncate text-sm font-bold text-red-950 dark:text-yellow-100">{user?.name}</p>
        <p className="truncate text-xs text-red-600 dark:text-yellow-200">{user?.role}</p>
      </div>
    </aside>
  );
}
