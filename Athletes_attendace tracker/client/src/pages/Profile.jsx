import { Mail, Phone, Trophy, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const fields = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Trophy, label: "Event", value: user.event },
    { icon: UserRound, label: "Department", value: user.department },
    { icon: Phone, label: "Phone", value: user.phone || "Not added" }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-soft dark:bg-slate-950">
        <p className="text-sm font-bold uppercase text-track-lane">Profile</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">{user.name}</h1>
        <p className="mt-2 capitalize text-xs text-slate-500 sm:text-sm">{user.role} · {user.year}</p>
      </section>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-slate-100 text-track-lane dark:bg-slate-900">
              <field.icon size={21} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-slate-500">{field.label}</p>
              <p className="font-semibold truncate">{field.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
