import StatusBadge from "./ui/StatusBadge";

export default function AttendanceTable({ records, athletes }) {
  const getAthleteDetails = (id) => {
    const athlete = athletes.find((athlete) => athlete.id === id);
    return {
      name: athlete?.name || "Unknown athlete",
      department: athlete?.department || "N/A"
    };
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Athlete</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Morning</th>
              <th className="px-4 py-3">Evening</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((record) => {
              const { name, department } = getAthleteDetails(record.athleteId);
              return (
                <tr key={record.id || `${record.athleteId}-${record.date}`}>
                  <td className="px-4 py-3 font-semibold">{record.date}</td>
                  <td className="px-4 py-3">{name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{department}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={record.morning} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={record.evening} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
