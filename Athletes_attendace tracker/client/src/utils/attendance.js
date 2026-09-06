export const ATTENDANCE_STATUSES = ["Present", "Absent", "Late"];

export function statusScore(status) {
  if (status === "Present") return 1;
  if (status === "Late") return 0.5;
  return 0;
}

export function calculateAttendance(records = []) {
  const sessions = records.flatMap((record) => [record.morning, record.evening]).filter(Boolean);
  const present = sessions.filter((status) => status === "Present").length;
  const late = sessions.filter((status) => status === "Late").length;
  const absent = sessions.filter((status) => status === "Absent").length;
  const earned = sessions.reduce((sum, status) => sum + statusScore(status), 0);
  const percentage = sessions.length ? Math.round((earned / sessions.length) * 100) : 0;

  return {
    present,
    late,
    absent,
    totalSessions: sessions.length,
    percentage
  };
}

export function getMonthlySeries(records = []) {
  const buckets = {};

  records.forEach((record) => {
    const day = record.date.slice(5);
    buckets[day] = buckets[day] || { day, Present: 0, Late: 0, Absent: 0 };
    buckets[day][record.morning] += 1;
    buckets[day][record.evening] += 1;
  });

  return Object.values(buckets).sort((a, b) => a.day.localeCompare(b.day));
}

export function warningForPercentage(percentage) {
  if (percentage < 60) return "Critical attendance warning";
  if (percentage < 75) return "Needs attention";
  return "Healthy attendance";
}
