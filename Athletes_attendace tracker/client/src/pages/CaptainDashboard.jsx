import { CalendarCheck, Download, Percent, Users } from "lucide-react";
import { useState } from "react";
import AttendanceChart from "../components/charts/AttendanceChart";
import AttendanceTable from "../components/AttendanceTable";
import StatCard from "../components/ui/StatCard";
import UpcomingEvent from "../components/UpcomingEvent";
import { useTrackerData } from "../hooks/useTrackerData";
import { calculateAttendance, getMonthlySeries } from "../utils/attendance";
import { exportAttendanceToCSV } from "../utils/csvExport";

export default function CaptainDashboard() {
  const { athletes, attendance } = useTrackerData();

  // Get last 7 days attendance (not future dates)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6); // 6 days ago + today = 7 days

  const todayStr = today.toISOString().slice(0, 10);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const lastSevenDaysAttendance = attendance.filter((record) => {
    return record.date >= sevenDaysAgoStr && record.date <= todayStr;
  });

  // Present / Absent list for a captain-selected date
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const attendanceForSelectedDate = attendance.filter((record) => record.date === selectedDate);
  const presentAthleteIds = new Set(
    attendanceForSelectedDate
      .filter((record) => record.morning === "Present" || record.evening === "Present")
      .map((record) => record.athleteId)
  );
  const presentList = athletes.filter((athlete) => presentAthleteIds.has(athlete.id));
  const absentList = athletes.filter((athlete) => !presentAthleteIds.has(athlete.id));

  const stats = calculateAttendance(lastSevenDaysAttendance);
  const todayMarked = lastSevenDaysAttendance.filter((record) => record.date === todayStr).length;
  const sortedLastSevenDaysAttendance = [...lastSevenDaysAttendance].sort((a, b) => b.date.localeCompare(a.date));

  // Calculate overall stats (all attendance records)
  const overallStats = calculateAttendance(attendance);
  const athletePresentDays = athletes
    .map((athlete) => {
      const presentDates = new Set(
        attendance
          .filter((record) => record.athleteId === athlete.id && (record.morning === "Present" || record.evening === "Present"))
          .map((record) => record.date)
      );

      return {
        id: athlete.id,
        name: athlete.name,
        department: athlete.department,
        event: athlete.event,
        presentDays: presentDates.size
      };
    })
    .sort((a, b) => b.presentDays - a.presentDays || a.name.localeCompare(b.name));

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportAttendanceToCSV(lastSevenDaysAttendance, athletes, `attendance_${timestamp}.csv`);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg bg-white p-6 shadow-soft dark:bg-slate-950 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase text-track-lane">Captain dashboard</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Training attendance control</h1>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">Last 7 days attendance summary and management.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <a href="/attendance" className="rounded-lg bg-track-lane px-5 py-3 text-center font-bold text-white whitespace-nowrap">Mark attendance</a>
          <button onClick={handleExportCSV} className="rounded-lg bg-track-lane px-5 py-3 text-center font-bold text-white whitespace-nowrap flex items-center gap-2 hover:bg-red-900">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </section>

      <UpcomingEvent />

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
        <StatCard title="Athletes" value={athletes.length} helper="Total Athletes" icon={Users} tone="blue" />
        <StatCard title="This Week" value={todayMarked} helper="This Week Count" icon={CalendarCheck} tone="green" />
        <StatCard title="Overall" value={`${overallStats.percentage}%`} helper="Total attendance percentage" icon={Percent} tone="slate" />
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
          <h2 className="text-base font-black">Present &amp; absent list by date</h2>
          <input
            type="date"
            value={selectedDate}
            max={todayStr}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
        <div className="grid gap-0 divide-y divide-slate-200 dark:divide-slate-800 md:grid-cols-2 md:divide-x md:divide-y-0">
          <div>
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="text-sm font-black text-track-field">Present ({presentList.length})</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {presentList.map((athlete) => (
                    <tr key={athlete.id}>
                      <td className="px-5 py-3">
                        <p className="font-bold">{athlete.name}</p>
                        <p className="text-xs text-slate-500">{athlete.department || "N/A"} · {athlete.event || "N/A"}</p>
                      </td>
                    </tr>
                  ))}
                  {presentList.length === 0 && (
                    <tr>
                      <td className="px-5 py-6 text-sm font-semibold text-slate-500">No athletes present on this date</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="text-sm font-black text-track-lane">Absent ({absentList.length})</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {absentList.map((athlete) => (
                    <tr key={athlete.id}>
                      <td className="px-5 py-3">
                        <p className="font-bold">{athlete.name}</p>
                        <p className="text-xs text-slate-500">{athlete.department || "N/A"} · {athlete.event || "N/A"}</p>
                      </td>
                    </tr>
                  ))}
                  {absentList.length === 0 && (
                    <tr>
                      <td className="px-5 py-6 text-sm font-semibold text-slate-500">No athletes absent on this date</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-black">Athlete present days</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3">Athlete</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Days Present</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {athletePresentDays.map((athlete) => (
                <tr key={athlete.id}>
                  <td className="px-4 py-3">
                    <p className="font-bold">{athlete.name}</p>
                    <p className="text-xs text-slate-500">{athlete.department || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3">{athlete.event || "N/A"}</td>
                  <td className="px-4 py-3 text-lg font-black">{athlete.presentDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AttendanceChart data={getMonthlySeries(lastSevenDaysAttendance)} />
      <AttendanceTable records={sortedLastSevenDaysAttendance} athletes={athletes} />
    </div>
  );
}
