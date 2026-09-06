import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import AttendanceChart from "../components/charts/AttendanceChart";
import AttendanceTable from "../components/AttendanceTable";
import { useTrackerData } from "../hooks/useTrackerData";
import { calculateAttendance, getMonthlySeries } from "../utils/attendance";
import { exportAttendanceToCSV } from "../utils/csvExport";

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getCurrentWeekValue() {
  const currentDate = new Date();
  const day = currentDate.getDay() || 7;
  const thursday = new Date(currentDate);
  thursday.setDate(currentDate.getDate() + 4 - day);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const week = Math.ceil(((thursday - yearStart) / 86400000 + 1) / 7);
  return `${thursday.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getWeekRange(weekValue) {
  const [year, week] = weekValue.split("-W").map(Number);
  const firstDay = new Date(year, 0, 1 + (week - 1) * 7);
  const day = firstDay.getDay() || 7;
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - day + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: formatDate(start), end: formatDate(end) };
}

function getRange(rangeType, rangeValue) {
  if (!rangeValue) {
    const today = formatDate(new Date());
    return { start: today, end: today };
  }

  if (rangeType === "date") {
    return { start: rangeValue, end: rangeValue };
  }

  if (rangeType === "week") {
    return getWeekRange(rangeValue);
  }

  const [year, month] = rangeValue.split("-").map(Number);
  const start = `${rangeValue}-01`;
  const end = formatDate(new Date(year, month, 0));
  return { start, end };
}

export default function Reports() {
  const { athletes, attendance } = useTrackerData();
  const today = formatDate(new Date());
  const [rangeType, setRangeType] = useState("month");
  const [rangeValues, setRangeValues] = useState({
    date: today,
    week: getCurrentWeekValue(),
    month: today.slice(0, 7)
  });

  const selectedRange = getRange(rangeType, rangeValues[rangeType]);
  const filteredAttendance = useMemo(
    () =>
      attendance
        .filter((record) => record.date >= selectedRange.start && record.date <= selectedRange.end)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [attendance, selectedRange.start, selectedRange.end]
  );
  const stats = calculateAttendance(filteredAttendance);

  function exportCsv() {
    const filename = `attendance-${rangeType}-${rangeValues[rangeType]}.csv`;
    exportAttendanceToCSV(filteredAttendance, athletes, filename);
  }

  function updateRangeValue(value) {
    setRangeValues((current) => ({ ...current, [rangeType]: value }));
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg bg-white p-6 shadow-soft dark:bg-slate-950 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase text-track-lane">Reports</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Attendance reports and analytics</h1>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">Program attendance is currently {stats.percentage}% across recorded sessions.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={rangeType}
            onChange={(event) => setRangeType(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-3 font-semibold dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="date">Date</option>
          </select>
          <input
            type={rangeType}
            value={rangeValues[rangeType]}
            onChange={(event) => updateRangeValue(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-3 font-semibold dark:border-slate-800 dark:bg-slate-900"
          />
          <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-lg bg-track-lane px-5 py-3 font-bold text-white whitespace-nowrap">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </section>

      <AttendanceChart data={getMonthlySeries(filteredAttendance)} />
      <AttendanceTable records={filteredAttendance} athletes={athletes} />
    </div>
  );
}
