import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AttendanceChart({ data }) {
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold">Session Trend</h2>
        <span className="text-xs font-semibold text-slate-500">Morning + evening</span>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Present" fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Late" fill="#FFD700" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Absent" fill="#8B0000" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
