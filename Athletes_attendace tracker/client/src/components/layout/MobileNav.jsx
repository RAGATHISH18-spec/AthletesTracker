import { Activity, CalendarCheck, ClipboardList, Home, Settings, Shield, User, UserCheck, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linksByRole = {
  athlete: [
    { to: "/athlete", icon: Home, label: "Home" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ],
  captain: [
    { to: "/captain", icon: Home, label: "Home" },
    { to: "/attendance", icon: CalendarCheck, label: "Mark" },
    { to: "/coach-attendance", icon: UserCheck, label: "Coach" },
    { to: "/reports", icon: ClipboardList, label: "Reports" },
    { to: "/profile", icon: User, label: "Profile" }
  ],
  alumni: [
    { to: "/alumni", icon: Activity, label: "Team" },
    { to: "/profile", icon: User, label: "Profile" }
  ],
  admin: [
    { to: "/admin", icon: Shield, label: "Admin" },
    { to: "/attendance", icon: CalendarCheck, label: "Mark" },
    { to: "/coach-attendance", icon: UserCheck, label: "Coach" },
    { to: "/reports", icon: ClipboardList, label: "Reports" },
    { to: "/profile", icon: Users, label: "Users" }
  ]
};

export default function MobileNav() {
  const { user } = useAuth();
  const links = linksByRole[user?.role] || [];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-red-300 bg-gradient-to-r from-yellow-50 to-orange-50 px-2 py-2 shadow-soft backdrop-blur dark:border-yellow-700 dark:bg-gradient-to-r dark:from-red-950/95 dark:to-red-900/95 lg:hidden">
      <div className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))` }}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-bold transition ${
                isActive ? "bg-track-lane text-yellow-100 shadow-md" : "text-red-600 dark:text-yellow-200 hover:text-red-900 dark:hover:text-yellow-300"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
