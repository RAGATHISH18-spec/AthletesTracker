import { Activity } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const demoEmails = ["athlete@track.edu", "captain@track.edu", "alumni@track.edu", "admin@track.edu"];

export default function Login() {
  const { login, isDemoMode, toggleDemoMode, firebaseStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isProduction = import.meta.env.PROD;

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      console.error("Sign in failed:", err);
      // Provide user-friendly error messages
      if (err.message?.includes("offline") || err.code === "unavailable" || err.message?.includes("network")) {
        setError("Network connection failed. Please check your internet connection or switch to Demo Mode.");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(err.message || "Sign in failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  const renderStatusBadge = () => {
    switch (firebaseStatus) {
      case "checking":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            Connecting to Firebase...
          </span>
        );
      case "connected":
        /*return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Firebase Online
          </span>
        );*/
      case "unreachable":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Firebase Unreachable (Demo Fallback)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Demo Mode Only
          </span>
        );
    }
  };

  return (
    <main className="grid min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 text-red-950 lg:grid-cols-[1.05fr_0.95fr] dark:from-red-950 dark:to-yellow-900 dark:text-yellow-100">
<section className="relative flex min-h-[40vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-screen w-full items-center justify-center bg-[url('/logo.jpeg')] bg-cover bg-center bg-no-repeat p-4 sm:p-6 md:p-8 lg:p-10">  <div className="absolute inset-0 bg-slate-950/45" />
  
</section>
      <section className="flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-6 text-red-950 dark:from-red-900 dark:to-yellow-900 dark:text-yellow-100">
       
        <form onSubmit={handleSubmit} className="w-full max-w-md">
<div>    <h1 className="text-5xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
      <span className="text-red-700">IMMOR</span>
      <span className="text-yellow-500">TALS</span>
    </h1>
    
  </div>
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase text-red-700 dark:text-yellow-300">Welcome back</p>
              
            </div>
            <h2 className="text-3xl font-black text-red-950 dark:text-yellow-100">Sign in</h2>
          </div>

          {firebaseStatus === "unreachable" && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-900 dark:border-red-900/40 dark:bg-red-900/40 dark:text-yellow-100">
              ⚠️ Firebase is currently offline or unreachable. We've set your workspace to **Demo Mode** with mock data so you can log in below.
            </div>
          )}

          

          <label className="block text-sm font-semibold text-red-950 dark:text-yellow-200">Email</label>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 w-full rounded-lg border-2 border-red-300 px-4 py-3 outline-none focus:border-red-600 bg-yellow-50 text-red-950 dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100" required />

          <label className="mt-5 block text-sm font-semibold text-red-950 dark:text-yellow-200">Password</label>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 w-full rounded-lg border-2 border-red-300 px-4 py-3 outline-none focus:border-red-600 bg-yellow-50 text-red-950 dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100" required />

          {error && <p className="mt-4 rounded-lg bg-red-200 px-4 py-3 text-sm font-semibold text-red-900 dark:bg-red-900/60 dark:text-yellow-100">{error}</p>}

          <button disabled={busy} className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 font-bold text-yellow-100 transition hover:bg-red-900 disabled:opacity-60 dark:bg-red-600 dark:hover:bg-red-800">
            {busy ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-5 text-center text-sm text-red-800 dark:text-yellow-200">New athlete? <Link to="/register" className="font-bold text-red-700 dark:text-yellow-300">Create account</Link></p>

          {isDemoMode && (
            <div className="mt-8 rounded-lg border-2 border-red-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-red-900/30">
              <p className="text-sm font-bold text-red-950 dark:text-yellow-200">Demo accounts</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {demoEmails.map((item) => (
                  <button key={item} type="button" onClick={() => setEmail(item)} className="rounded-lg border-2 border-red-300 bg-yellow-100 px-3 py-2 text-left text-xs font-semibold text-red-950 hover:border-red-600 hover:bg-yellow-200 dark:border-yellow-700 dark:bg-red-900/40 dark:text-yellow-100 dark:hover:bg-red-900/60">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
