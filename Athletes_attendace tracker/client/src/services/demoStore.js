import { attendanceRecords, coachAttendanceRecords, demoUsers, sportsEvents } from "../data/mockData";

let attendance = [...attendanceRecords];
let coachAttendance = [...coachAttendanceRecords];
let users = [...demoUsers];

const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 250));

export async function demoSignIn(email, password) {
  if (!password || password.length < 6) {
    throw new Error("Use at least 6 characters for the demo password.");
  }

  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error("No demo user found for this email.");
  }

  return wait(user);
}

export async function demoRegister(payload) {
  // Assign role based on year if not already provided
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

  const user = {
    id: `demo-${Date.now()}`,
    ...payload,
    role,
    event: (role === "alumni" || role === "captain") ? payload.event : (payload.event || "100m Sprint"),
    department: payload.department || "Unassigned",
    year: payload.year || "1st Year"
  };
  users = [user, ...users];
  return wait(user);
}

export async function demoFetchUsers() {
  return wait([...users]);
}

export async function demoFetchAttendance() {
  return wait([...attendance]);
}

export async function demoFetchCoachAttendance() {
  return wait([...coachAttendance]);
}

export async function demoSaveAttendance(records, markedBy) {
  const today = records[0]?.date;
  const athleteIds = records.map((record) => record.athleteId);
  attendance = attendance.filter((record) => !(record.date === today && athleteIds.includes(record.athleteId)));
  attendance = [
    ...records.map((record) => ({
      ...record,
      id: `${record.athleteId}-${record.date}`,
      markedBy
    })),
    ...attendance
  ];
  return wait([...attendance]);
}

export async function demoSaveCoachAttendance(record, markedBy) {
  coachAttendance = coachAttendance.filter((item) => item.date !== record.date);
  coachAttendance = [
    {
      ...record,
      id: `coach-${record.date}`,
      markedBy
    },
    ...coachAttendance
  ];
  return wait([...coachAttendance]);
}

export async function demoFetchEvents() {
  return wait([...sportsEvents]);
}

export async function demoUpdateUserProfile(userId, updates) {
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
  }
  return wait(users[userIndex] || null);
}
