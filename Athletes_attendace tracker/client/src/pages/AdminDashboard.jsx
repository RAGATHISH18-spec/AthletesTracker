import { Download, ShieldCheck, Trophy, Users } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import { useTrackerData } from "../hooks/useTrackerData";
import { calculateAttendance } from "../utils/attendance";

export default function AdminDashboard() {
  const { users, athletes, events, attendance } = useTrackerData();
  const stats = calculateAttendance(attendance);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft">
        <p className="text-sm font-bold uppercase text-red-200">Admin dashboard</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Athletics program command center</h1>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">Manage users, roles, events, reports, and attendance analytics.</p>
      </section>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <StatCard title="Total Users" value={users.length} helper="All roles" icon={Users} tone="blue" />
        <StatCard title="Athletes" value={athletes.length} helper="Active roster" icon={Trophy} tone="green" />
        <StatCard title="Sports Events" value={events.length} helper="Managed categories" icon={ShieldCheck} tone="red" />
        <StatCard title="Attendance" value={`${stats.percentage}%`} helper="Program health" icon={Download} tone="slate" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-lg font-black">User Management</h2>
          <div className="mt-4 space-y-3">
            {users.slice(0, 6).map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-900">
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 truncate">{item.email}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-slate-600 whitespace-nowrap dark:bg-slate-950 dark:text-slate-300">{item.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-lg font-black">Managed Events</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {events.map((event) => (
              <span key={event} className="rounded-full bg-slate-100 px-3 py-2 text-xs sm:text-sm font-semibold dark:bg-slate-900">{event}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
