import { Users } from "lucide-react";
import { useTrackerData } from "../hooks/useTrackerData";

export default function AlumniDashboard() {
  const { users } = useTrackerData();
  // Show athletes and captains as team members
  const teamMembers = (users || []).filter(u => u.role === "athlete" || u.role === "captain");

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-soft dark:bg-slate-950">
        <p className="text-sm font-bold uppercase text-track-lane">Alumni view</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Team Members Directory</h1>
        <p className="mt-2 text-xs text-slate-500 sm:text-sm">View current athletes and team captains.</p>
      </section>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <Users className="text-track-lane flex-shrink-0" size={24} />
          <h2 className="text-lg font-black">Team Members ({teamMembers.length})</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.id} className="rounded-lg bg-slate-50 px-4 py-4 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate">{member.email}</p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-track-lane whitespace-nowrap dark:bg-slate-950">
                    {member.role === "captain" ? "Captain" : "Athlete"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-500">Event</p>
                    <p className="font-semibold text-slate-700 truncate dark:text-slate-300">{member.event || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Department</p>
                    <p className="font-semibold text-slate-700 truncate dark:text-slate-300">{member.department}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Year</p>
                    <p className="font-semibold text-slate-700 truncate dark:text-slate-300">{member.year}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-700 truncate dark:text-slate-300">{member.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-sm text-slate-500">No team members available</p>
          )}
        </div>
      </div>
    </div>
  );
}
