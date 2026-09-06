import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import AttendanceChart from "../components/charts/AttendanceChart";
import AttendanceTable from "../components/AttendanceTable";
import StatCard from "../components/ui/StatCard";
import UpcomingEvent from "../components/UpcomingEvent";
import { useAuth } from "../context/AuthContext";
import { useTrackerData } from "../hooks/useTrackerData";
import { calculateAttendance, getMonthlySeries, warningForPercentage } from "../utils/attendance";

export default function AthleteDashboard() {
  const { user } = useAuth();
  const { users, athletes, attendance } = useTrackerData();
  const stats = calculateAttendance(attendance);
  const warning = warningForPercentage(stats.percentage);
  const captains = users.filter(u => u.role === "captain");

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft">
        <p className="text-sm font-bold uppercase text-red-200">Athlete dashboard</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Good session data, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 text-xs text-slate-300 sm:text-sm">{user.event} · {user.department} · {user.year}</p>
      </section>
      <UpcomingEvent />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <StatCard title="Present Sessions" value={stats.present} helper="Morning and evening" icon={CheckCircle2} tone="green" />
        <StatCard title="Absent Sessions" value={stats.absent} helper="Needs recovery plan" icon={XCircle} tone="red" />
        <StatCard title="Late Sessions" value={stats.late} helper="Half credit counted" icon={Clock} tone="amber" />
        <StatCard title="Attendance" value={`${stats.percentage}%`} helper={warning} icon={AlertTriangle} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AttendanceChart data={getMonthlySeries(attendance)} />
        <div className="space-y-6">
          
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-base font-bold">Team Captains</h2>
            <div className="mt-4 space-y-3">
              {captains.length > 0 ? (
                captains.map((captain) => (
                  <div key={captain.id} className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-900">
                    <p className="font-bold text-sm truncate">{captain.name}</p>
                    <p className="text-xs text-slate-500 truncate">{captain.email}</p>
                    <p className="text-xs text-track-lane font-semibold mt-1 truncate">{captain.event}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No captains assigned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AttendanceTable records={attendance} athletes={athletes} />
    </div>
  );
}
