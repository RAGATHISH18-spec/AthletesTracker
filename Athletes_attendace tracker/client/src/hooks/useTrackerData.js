import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { demoFetchAttendance, demoFetchCoachAttendance, demoFetchEvents, demoFetchUsers } from "../services/demoStore";
import {
  fetchAttendance,
  fetchCoachAttendance,
  fetchEvents,
  fetchUsers,
  subscribeAttendance,
  subscribeCoachAttendance,
  subscribeUsers
} from "../services/firebaseStore";

export function useTrackerData() {
  const { user, isDemoMode } = useAuth();
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [coachAttendance, setCoachAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const eventList = await (!isDemoMode ? fetchEvents() : demoFetchEvents());

        if (!active) return;
        setEvents(eventList);

        if (isDemoMode) {
          const userList = await demoFetchUsers();
          if (active) setUsers(userList);
          const rows = await demoFetchAttendance();
          if (active) {
            setAttendance(user.role === "athlete" ? rows.filter((row) => row.athleteId === user.id) : rows);
            if (["captain", "admin"].includes(user.role)) {
              setCoachAttendance(await demoFetchCoachAttendance());
            } else {
              setCoachAttendance([]);
            }
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error loading tracker data:", err);
        if (active) setLoading(false);
      }
    }

    load();

    if (!isDemoMode && user) {
      try {
        const unsubscribeUsers = subscribeUsers(
          (userList) => {
            if (active) {
              setUsers(userList);
            }
          },
          (err) => {
            console.error("Firestore users subscription failed:", err);
          }
        );

        const unsubscribeAttendance = subscribeAttendance(
          user,
          (rows) => {
            if (active) {
              setAttendance(rows);
              setLoading(false);
            }
          },
          (err) => {
            console.error("Firestore subscription failed asynchronously:", err);
            if (active) setLoading(false);
          }
        );

        const unsubscribeCoachAttendance = ["captain", "admin"].includes(user.role)
          ? subscribeCoachAttendance(
              (rows) => {
                if (active) setCoachAttendance(rows);
              },
              (err) => {
                console.error("Firestore coach attendance subscription failed:", err);
              }
            )
          : () => setCoachAttendance([]);

        return () => {
          active = false;
          unsubscribeUsers();
          unsubscribeAttendance();
          unsubscribeCoachAttendance();
        };
      } catch (err) {
        console.error("Error subscribing to attendance synchronously:", err);
        if (active) setLoading(false);
      }
    }

    return () => {
      active = false;
    };
  }, [user, isDemoMode]);

  const athletes = useMemo(() => users.filter((item) => item.role === "athlete"), [users]);

  return {
    users,
    athletes,
    attendance,
    coachAttendance,
    events,
    loading,
    setAttendance,
    setCoachAttendance
  };
}
