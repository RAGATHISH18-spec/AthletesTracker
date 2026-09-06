import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../firebase";
import { useTrackerData } from "../hooks/useTrackerData";
import { demoSaveAttendance } from "../services/demoStore";
import { saveAttendance } from "../services/firebaseStore";
import { ATTENDANCE_STATUSES } from "../utils/attendance";

export default function AttendanceManagement() {
  const { user } = useAuth();
  const { athletes, events, setAttendance } = useTrackerData();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [filters, setFilters] = useState({ event: "All", department: "All", year: "All", search: "" });
  const [rows, setRows] = useState({});
  const [saved, setSaved] = useState(false);

  // Get allowed date range for captain (last 7 days to today)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  const minDate = sevenDaysAgo.toISOString().slice(0, 10);
  const maxDate = today.toISOString().slice(0, 10);
  const isDateAllowed = user.role === "captain" && (date < minDate || date > maxDate);

  const departments = [...new Set(athletes.map((item) => item.department))];
  const years = [...new Set(athletes.map((item) => item.year))];

  const filteredAthletes = useMemo(
    () =>
      athletes.filter((athlete) => {
        const matchesEvent = filters.event === "All" || athlete.event === filters.event;
        const matchesDepartment = filters.department === "All" || athlete.department === filters.department;
        const matchesYear = filters.year === "All" || athlete.year === filters.year;
        const matchesSearch = athlete.name.toLowerCase().includes(filters.search.toLowerCase());
        return matchesEvent && matchesDepartment && matchesYear && matchesSearch;
      }),
    [athletes, filters]
  );

  function updateRow(athleteId, session, status) {
    setRows((current) => ({
      ...current,
      [athleteId]: {
        morning: "Present",
        evening: "Present",
        ...current[athleteId],
        [session]: status
      }
    }));
  }

  async function handleSave() {
    const payload = filteredAthletes.map((athlete) => ({
      athleteId: athlete.id,
      date,
      morning: rows[athlete.id]?.morning || "Present",
      evening: rows[athlete.id]?.evening || "Present"
    }));

    if (isFirebaseConfigured) {
      await saveAttendance(payload, user.id);
    } else {
      const updated = await demoSaveAttendance(payload, user.id);
      setAttendance(updated);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-soft dark:bg-slate-950">
        <p className="text-sm font-bold uppercase text-track-lane">Attendance management</p>
        <h1 className="mt-2 text-3xl font-black">Mark morning and evening sessions</h1>
      </section>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <input 
            type="date" 
            value={date} 
            onChange={(event) => setDate(event.target.value)}
            min={user.role === "captain" ? minDate : undefined}
            max={user.role === "captain" ? maxDate : undefined}
            className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-800 dark:bg-slate-900 w-full" 
          />
          {isDateAllowed && <p className="text-xs text-red-600 mt-1">Only last 7 days allowed</p>}
        </div>
        <select value={filters.event} onChange={(event) => setFilters({ ...filters, event: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <option>All</option>
          {events.map((event) => <option key={event}>{event}</option>)}
        </select>
        <select value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <option>All</option>
          {departments.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.year} onChange={(event) => setFilters({ ...filters, year: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <option>All</option>
          {years.map((item) => <option key={item}>{item}</option>)}
        </select>
        <input placeholder="Search athlete" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 md:col-span-1" />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3">Athlete</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Morning</th>
                <th className="px-4 py-3">Evening</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAthletes.map((athlete) => (
                <tr key={athlete.id}>
                  <td className="px-4 py-3">
                    <p className="font-bold">{athlete.name}</p>
                    <p className="text-xs text-slate-500">{athlete.department} · {athlete.year}</p>
                  </td>
                  <td className="px-4 py-3">{athlete.event}</td>
                  {["morning", "evening"].map((session) => (
                    <td key={session} className="px-4 py-3">
                      <select value={rows[athlete.id]?.[session] || "Present"} onChange={(event) => updateRow(athlete.id, session, event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                        {ATTENDANCE_STATUSES.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm font-bold text-track-field text-black">ATTENDANCE SAVED</span>}
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-track-lane px-5 py-3 font-bold text-white">
          <Save size={18} />
          Save attendance
        </button>
      </div>
    </div>
  );
}
