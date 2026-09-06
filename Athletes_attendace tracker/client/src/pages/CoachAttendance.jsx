import { Download, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../firebase";
import { useTrackerData } from "../hooks/useTrackerData";
import { demoSaveCoachAttendance } from "../services/demoStore";
import { saveCoachAttendance } from "../services/firebaseStore";
import { exportCoachAttendanceToCSV } from "../utils/csvExport";

export default function CoachAttendance() {
  const { user, isDemoMode } = useAuth();
  const { coachAttendance, setCoachAttendance } = useTrackerData();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const sortedRecords = [...coachAttendance].sort((a, b) => b.date.localeCompare(a.date));
  const presentDays = sortedRecords.filter((record) => record.status === "Present").length;
  const absentDays = sortedRecords.filter((record) => record.status === "Absent").length;

  async function handleMark(status) {
    const payload = {
      date,
      status
    };

    setSaving(true);
    setError("");

    try {
      if (isFirebaseConfigured && !isDemoMode) {
        await saveCoachAttendance(payload, user.id);
        setCoachAttendance((current) => [
          { ...payload, id: date, markedBy: user.id },
          ...current.filter((record) => record.date !== date)
        ]);
      } else {
        const updated = await demoSaveCoachAttendance(payload, user.id);
        setCoachAttendance(updated);
      }

      setSaved(status);
      setTimeout(() => setSaved(false), 2400);
    } catch (err) {
      console.error("Error saving coach attendance:", err);
      setError(err.message || "Could not save coach attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleExportCSV() {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportCoachAttendanceToCSV(sortedRecords, `coach_attendance_${timestamp}.csv`);
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg bg-white p-6 shadow-soft dark:bg-slate-950 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase text-track-lane">Coach attendance</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Mark coach attendance</h1>
        </div>
        <button onClick={handleExportCSV} className="rounded-lg bg-track-lane px-5 py-3 text-center font-bold text-white whitespace-nowrap flex items-center gap-2 hover:bg-red-900">
          <Download size={18} />
          Export CSV
        </button>
      </section>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-2">
        <StatCard title="Coach Present Days" value={presentDays} helper="Total days present" icon={UserCheck} tone="green" />
        <StatCard title="Coach Absent Days" value={absentDays} helper="Total days absent" icon={UserX} tone="red" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Mark Attendance</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-3 dark:border-slate-800 dark:bg-slate-900"
          />
          <button disabled={saving} onClick={() => handleMark("Present")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-track-field px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
            <UserCheck size={18} />
            Mark Present
          </button>
          <button disabled={saving} onClick={() => handleMark("Absent")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-track-lane px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
            <UserX size={18} />
            Mark Absent
          </button>
        </div>
        {saved && (
          <p className="mt-3 text-sm font-bold text-track-field">
            COACH MARKED {saved.toUpperCase()} FOR {date}
          </p>
        )}
        {error && <p className="mt-3 text-sm font-bold text-red-600">{error}</p>}
      </section>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-black">Coach attendance history</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedRecords.map((record) => (
                <tr key={record.id || `coach-${record.date}`}>
                  <td className="px-4 py-3 font-semibold">{record.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        record.status === "Present"
                          ? "bg-track-field text-black"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sortedRecords.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-sm font-semibold text-slate-500" colSpan={2}>No coach attendance marked yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
