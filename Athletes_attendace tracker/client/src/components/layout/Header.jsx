import { LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { user, logout, isDemoMode } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b-2 border-red-300 bg-gradient-to-r from-yellow-50 to-orange-50 backdrop-blur dark:border-yellow-700 dark:from-red-900/80 dark:to-yellow-900/80">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        {isDemoMode && <span className="rounded-full bg-red-200 px-3 py-1 text-xs font-bold text-red-900 dark:bg-red-900/40 dark:text-yellow-200">Demo mode</span>}
        <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-lg border-2 border-red-300 text-red-700 dark:border-yellow-700 dark:text-yellow-300" title="Toggle theme">
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-red-950 dark:text-yellow-100">{user?.name}</p>
          <p className="text-xs capitalize text-red-700 dark:text-yellow-300">{user?.role}</p>
        </div>
        <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-lg bg-red-700 text-yellow-100 dark:bg-yellow-500 dark:text-red-950 hover:bg-red-900 dark:hover:bg-yellow-600" title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
