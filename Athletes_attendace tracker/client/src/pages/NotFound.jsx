import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6 text-center dark:bg-slate-950">
      <div>
        <p className="text-sm font-bold uppercase text-track-lane">404</p>
        <h1 className="mt-2 text-4xl font-black">Page not found</h1>
        <Link to="/login" className="mt-6 inline-block rounded-lg bg-track-lane px-5 py-3 font-bold text-white">Back to login</Link>
      </div>
    </main>
  );
}
