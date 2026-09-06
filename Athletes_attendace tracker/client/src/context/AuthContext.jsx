import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isFirebaseConfigured, checkFirebaseConnection } from "../firebase";
import { demoRegister, demoSignIn, demoUpdateUserProfile } from "../services/demoStore";
import { firebaseLogout, firebaseRegister, firebaseSignIn, listenToAuth, updateUserProfile } from "../services/firebaseStore";

const AuthContext = createContext(null);

export const roleHome = {
  athlete: "/athlete",
  captain: "/captain",
  alumni: "/alumni",
  admin: "/admin"
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const isDemo = !isFirebaseConfigured;
    const key = isDemo ? "track-user-demo" : "track-user-live";
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  });
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);
  const [firebaseStatus, setFirebaseStatus] = useState(isFirebaseConfigured ? "checking" : "disabled");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    let unsubscribe = null;

    async function initialize() {
      if (!isFirebaseConfigured) {
        setFirebaseStatus("disabled");
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      try {
        setFirebaseStatus("checking");
        const online = await checkFirebaseConnection();
        
        if (!active) return;

        if (online) {
          setFirebaseStatus("connected");
          setIsDemoMode(false);
          
          unsubscribe = listenToAuth((profile) => {
            if (active) {
              setUser(profile);
              setLoading(false);
            }
          });
        } else {
          console.warn("Firebase services are offline/unreachable. Switched to Demo Mode.");
          setFirebaseStatus("unreachable");
          setIsDemoMode(true);
          const stored = localStorage.getItem("track-user-demo");
          setUser(stored ? JSON.parse(stored) : null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        if (active) {
          setFirebaseStatus("unreachable");
          setIsDemoMode(true);
          const stored = localStorage.getItem("track-user-demo");
          setUser(stored ? JSON.parse(stored) : null);
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    const key = isDemoMode ? "track-user-demo" : "track-user-live";
    if (user) localStorage.setItem(key, JSON.stringify(user));
    else localStorage.removeItem(key);
  }, [user, isDemoMode]);

  async function login(email, password) {
    const profile = !isDemoMode ? await firebaseSignIn(email, password) : await demoSignIn(email, password);
    setUser(profile);
    navigate(roleHome[profile.role] || "/profile", { replace: true });
  }

  async function register(payload) {
    const profile = !isDemoMode ? await firebaseRegister(payload) : await demoRegister(payload);
    setUser(profile);
    navigate(roleHome[profile.role] || "/profile", { replace: true });
  }

  async function logout() {
    if (!isDemoMode) await firebaseLogout();
    setUser(null);
    navigate("/login", { replace: true });
  }

  function updateUser(updates) {
    setUser((current) => ({ ...current, ...updates }));
  }

  async function saveUserProfile(updates) {
    if (!user) return;
    try {
      if (!isDemoMode) {
        await updateUserProfile(user.id, updates);
      } else {
        await demoUpdateUserProfile(user.id, updates);
      }
      setUser((current) => ({ ...current, ...updates }));
    } catch (err) {
      console.error("Error saving profile:", err);
      throw err;
    }
  }

  function toggleDemoMode(value) {
    setIsDemoMode(value);
    const key = value ? "track-user-demo" : "track-user-live";
    const stored = localStorage.getItem(key);
    setUser(stored ? JSON.parse(stored) : null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isDemoMode,
      toggleDemoMode,
      firebaseStatus,
      login,
      register,
      logout,
      updateUser,
      saveUserProfile
    }),
    [user, loading, isDemoMode, firebaseStatus]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
