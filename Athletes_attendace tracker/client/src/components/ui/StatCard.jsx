export default function StatCard({ title, value, helper, icon: Icon, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-900 text-white",
    red: "bg-track-lane text-white",
    green: "bg-track-field text-white",
    blue: "bg-track-sky text-white",
    amber: "bg-amber-500 text-white"
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-black">{value}</p>
          {helper && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>}
        </div>
        {Icon && (
          <div className={`grid h-11 w-11 place-items-center rounded-lg ${tones[tone]}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
