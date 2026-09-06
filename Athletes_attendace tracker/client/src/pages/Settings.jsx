import { Bell, Moon, ShieldCheck, Edit2, X, Check } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, saveUserProfile } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    event: user?.event || "100m Sprint"
  });

  function handleEditChange(field, value) {
    setEditForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSaveProfile() {
    setIsSaving(true);
    try {
      await saveUserProfile(editForm);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setEditForm({
      name: user?.name || "",
      phone: user?.phone || "",
      department: user?.department || "",
      event: user?.event || "100m Sprint"
    });
    setIsEditingProfile(false);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-soft dark:bg-slate-950">
        <p className="text-sm font-bold uppercase text-track-lane">Settings</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Workspace preferences</h1>
      </section>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <Moon className="text-track-lane" />
          <h2 className="mt-4 font-black">Theme</h2>
          <p className="mt-1 text-sm text-slate-500">Current mode: <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{theme}</span></p>
          <button 
            onClick={toggleTheme}
            className="mt-3 rounded-lg bg-track-lane px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <Bell className="text-track-lane" />
          <h2 className="mt-4 font-black">Low Attendance Alerts</h2>
          <p className="mt-1 text-sm text-slate-500">Ready for push notification integration.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <ShieldCheck className="text-track-lane" />
          <h2 className="mt-4 font-black">Role Security</h2>
          <p className="mt-1 text-sm text-slate-500">Firestore rules enforce captain, admin, athlete, and alumni access.</p>
        </div>
      </div>

      {/* Edit Profile Section */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase text-track-lane">Profile</p>
            <h2 className="mt-2 text-2xl font-black">Edit your profile</h2>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center justify-center gap-2 rounded-lg bg-track-lane px-4 py-2 text-white font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Edit2 size={18} />
            Edit
          </button>
        </div>

        {!isEditingProfile ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase text-slate-500">Full Name</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase text-slate-500">Phone</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{user?.phone}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase text-slate-500">Department</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{user?.department}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase text-slate-500">Event</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">{user?.event}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Department</label>
              <input
                type="text"
                value={editForm.department}
                onChange={(e) => handleEditChange("department", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Enter department"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Event</label>
              <select
                value={editForm.event}
                onChange={(e) => handleEditChange("event", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option>100m Sprint</option>
                <option>400m Sprint</option>
                <option>1500m</option>
                <option>Long Jump</option>
                <option>Javelin Throw</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 flex-1 rounded-lg bg-track-lane px-4 py-3 text-white font-semibold hover:bg-red-900 transition-colors"
              >
                <Check size={18} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
