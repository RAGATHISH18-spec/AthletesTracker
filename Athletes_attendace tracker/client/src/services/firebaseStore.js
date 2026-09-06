import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db, isFirebaseConfigured } from "../firebase";

const profileCache = new Map();

export async function fetchUserProfile(uid) {
  if (profileCache.has(uid)) {
    return profileCache.get(uid);
  }

  const promise = (async () => {
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const snapshot = await getDoc(doc(db, "users", uid));
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Safely serialize Firestore Timestamp to prevent JSON stringify crashes
          if (data.createdAt && typeof data.createdAt.toDate === "function") {
            data.createdAt = data.createdAt.toDate().toISOString();
          }
          return { id: snapshot.id, ...data };
        }
        return null;
      } catch (error) {
        // Check if error is network-related
        if (error.code === "unavailable" || error.message?.includes("offline")) {
          if (i < maxRetries - 1) {
            // Wait before retrying (exponential backoff)
            await new Promise((resolve) => setTimeout(resolve, (i + 1) * 1000));
            continue;
          }
        }
        profileCache.delete(uid);
        throw error;
      }
    }
  })();

  profileCache.set(uid, promise);
  // Remove from cache after 5 seconds to allow eventual updates
  setTimeout(() => profileCache.delete(uid), 5000);
  return promise;
}

export function listenToAuth(callback) {
  if (!isFirebaseConfigured) return () => {};

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const profile = await fetchUserProfile(firebaseUser.uid);
      callback({ id: firebaseUser.uid, email: firebaseUser.email, ...profile });
    } catch (error) {
      console.error("Error fetching user profile in auth listener:", error);
      // Fallback to cached profile to prevent role downgrade
      const cachedUser = localStorage.getItem("track-user-live");
      const parsed = cachedUser ? JSON.parse(cachedUser) : null;
      if (parsed && parsed.id === firebaseUser.uid) {
        callback(parsed);
      } else {
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          role: "athlete"
        });
      }
    }
  });
}

export async function firebaseSignIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await fetchUserProfile(credential.user.uid);
  return { id: credential.user.uid, email: credential.user.email, ...profile };
}

export async function firebaseRegister(payload) {
  let credential;
  try {
    credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
  } catch (authError) {
    throw authError;
  }

  // Assign role based on year
  let role = payload.role;
  if (!role) {
    if (payload.year === "Final Year") {
      role = "captain";
    } else if (["1st Year", "2nd Year", "3rd Year"].includes(payload.year)) {
      role = "athlete";
    } else {
      role = "alumni";
    }
  }

  const profile = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    role,
    event: (role === "alumni" || role === "captain") ? payload.event : (payload.event || ""),
    department: payload.department || "",
    year: payload.year || "",
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "users", credential.user.uid), profile);
    return { id: credential.user.uid, ...profile };
  } catch (firestoreError) {
    // Rollback the created Auth account to prevent orphaned accounts
    if (credential.user) {
      try {
        await credential.user.delete();
      } catch (deleteError) {
        console.error("Failed to delete auth user after firestore register failure:", deleteError);
      }
    }
    throw firestoreError;
  }
}

export async function firebaseLogout() {
  await signOut(auth);
}

export async function fetchUsers() {
  const snapshot = await getDocs(query(collection(db, "users"), orderBy("name")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function subscribeUsers(callback, onError) {
  return onSnapshot(
    query(collection(db, "users"), orderBy("name")),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    (error) => {
      if (onError) onError(error);
      else console.error("Error subscribing to users:", error);
    }
  );
}

export async function fetchAttendance(user) {
  const constraints = user.role === "athlete" ? [where("athleteId", "==", user.id), orderBy("date", "desc")] : [orderBy("date", "desc")];
  const snapshot = await getDocs(query(collection(db, "attendance"), ...constraints));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function fetchCoachAttendance() {
  const snapshot = await getDocs(query(collection(db, "coachAttendance"), orderBy("date", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function subscribeAttendance(user, callback, onError) {
  const constraints = user.role === "athlete" ? [where("athleteId", "==", user.id), orderBy("date", "desc")] : [orderBy("date", "desc")];
  return onSnapshot(
    query(collection(db, "attendance"), ...constraints),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    (error) => {
      if (onError) onError(error);
      else console.error("Error subscribing to attendance:", error);
    }
  );
}

export function subscribeCoachAttendance(callback, onError) {
  return onSnapshot(
    query(collection(db, "coachAttendance"), orderBy("date", "desc")),
    (snapshot) => {
      callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    (error) => {
      if (onError) onError(error);
      else console.error("Error subscribing to coach attendance:", error);
    }
  );
}

export async function saveAttendance(records, markedBy) {
  await Promise.all(
    records.map((record) =>
      setDoc(doc(db, "attendance", `${record.athleteId}_${record.date}`), {
        ...record,
        markedBy,
        updatedAt: serverTimestamp()
      })
    )
  );
}

export async function saveCoachAttendance(record, markedBy) {
  await setDoc(doc(db, "coachAttendance", record.date), {
    ...record,
    markedBy,
    updatedAt: serverTimestamp()
  });
}

export async function fetchEvents() {
  const snapshot = await getDocs(query(collection(db, "sports_events"), orderBy("name")));
  return snapshot.docs.map((item) => item.data().name);
}

export async function updateUserProfile(uid, updates) {
  await setDoc(doc(db, "users", uid), updates, { merge: true });
}

export async function createReport(payload) {
  return addDoc(collection(db, "reports"), {
    ...payload,
    createdAt: serverTimestamp()
  });
}
