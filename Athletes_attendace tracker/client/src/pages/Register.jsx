import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    event: "100m Sprint",
    department: "",
    year: "1st Year",
    phone:"",
  });
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function getAutoAssignedRole(year) {
    if (year === "Final Year") return "captain";
    if (["1st Year", "2nd Year", "3rd Year"].includes(year)) return "athlete";
    return "alumni";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const role = getAutoAssignedRole(form.year);
      await register({ ...form, role });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:from-red-950 dark:to-yellow-900">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-lg border-2 border-red-300 bg-yellow-50 p-6 shadow-soft text-red-950 dark:border-yellow-700 dark:bg-red-900/30 dark:text-yellow-100">
        <p className="text-sm font-bold uppercase text-red-700 dark:text-yellow-300">Full team registration</p>
        <h1 className="mt-2 text-3xl font-black text-red-950 dark:text-yellow-100">Create your profile</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input placeholder="Full name" value={form.name} onChange={(event) => update("name", event.target.value)} className="rounded-lg border-2 border-red-300 px-4 py-3 bg-white text-red-950 placeholder-red-400 focus:border-red-600 focus:outline-none dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100 dark:placeholder-yellow-400" required />
          <input placeholder="Email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="rounded-lg border-2 border-red-300 px-4 py-3 bg-white text-red-950 placeholder-red-400 focus:border-red-600 focus:outline-none dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100 dark:placeholder-yellow-400" required />
          <input placeholder="Password" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} className="rounded-lg border-2 border-red-300 px-4 py-3 bg-white text-red-950 placeholder-red-400 focus:border-red-600 focus:outline-none dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100 dark:placeholder-yellow-400" required />
          <input placeholder="Phone no." type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className="rounded-lg border-2 border-red-300 px-4 py-3 bg-white text-red-950 placeholder-red-400 focus:border-red-600 focus:outline-none dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100 dark:placeholder-yellow-400" required />
          <select value={form.year} onChange={(event) => update("year", event.target.value)} className="rounded-lg border-2 border-red-300 px-4 py-3 bg-white text-red-950 focus:border-red-600 focus:outline-none dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100">
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>Final Year</option>
            
          </select>
          <select value={form.event} onChange={(event) => update("event", event.target.value)} className="rounded-lg border-2 border-red-300 px-4 py-3 bg-white text-red-950 focus:border-red-600 focus:outline-none dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100">
            <option>Sprint</option>
            <option>Mid distance</option>
            <option>Long distance</option>
            <option>Throws</option>
            <option>Jump</option>
          </select>
          <input placeholder="Department" value={form.department} onChange={(event) => update("department", event.target.value)} className="rounded-lg border-2 border-red-300 px-4 py-3 bg-white text-red-950 placeholder-red-400 focus:border-red-600 focus:outline-none dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100 dark:placeholder-yellow-400" required />
        </div>

        <div className="mt-4 rounded-lg border-2 border-red-300 bg-yellow-100 px-4 py-3 text-sm text-red-900 dark:border-yellow-700 dark:bg-red-900/50 dark:text-yellow-100">
          <p className="font-semibold">Role Assignment</p>
          <p className="mt-1 text-xs">Your role will be automatically assigned based on your year:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• <strong>Final Year</strong> → Team Captain</li>
            <li>• <strong>1st-3rd Year</strong> → Athlete</li>
            
          </ul>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-200 px-4 py-3 text-sm font-semibold text-red-900 dark:bg-red-900/60 dark:text-yellow-100">{error}</p>}

        <button className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 font-bold text-yellow-100 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800">Register</button>
        <p className="mt-5 text-center text-sm text-red-800 dark:text-yellow-200">Already registered? <Link to="/login" className="font-bold text-red-700 dark:text-yellow-300">Sign in</Link></p>
      </form>
    </main>
  );
}
