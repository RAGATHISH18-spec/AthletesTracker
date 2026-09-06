export const demoUsers = [
  {
    id: "athlete-demo",
    name: "Ananya Rao",
    email: "athlete@track.edu",
    role: "athlete",
    event: "400m Sprint",
    department: "Computer Science",
    year: "3rd Year",
    phone: "+91 90000 10001"
  },
  {
    id: "captain-demo",
    name: "Rohan Mehta",
    email: "captain@track.edu",
    role: "captain",
    event: "Middle Distance",
    department: "Mechanical",
    year: "Final Year",
    phone: "+91 90000 10002"
  },
  {
    id: "alumni-demo",
    name: "Maya Iyer",
    email: "alumni@track.edu",
    role: "alumni",
    event: "Long Jump",
    department: "Alumni",
    year: "2021 Batch",
    phone: "+91 90000 10003"
  },
  {
    id: "admin-demo",
    name: "Coach Dev",
    email: "admin@track.edu",
    role: "admin",
    event: "Athletics Program",
    department: "Sports Office",
    year: "Staff",
    phone: "+91 90000 10004"
  },
  {
    id: "athlete-2",
    name: "Kabir Singh",
    email: "kabir@track.edu",
    role: "athlete",
    event: "100m Sprint",
    department: "IT",
    year: "2nd Year",
    phone: "+91 90000 10005"
  },
  {
    id: "athlete-3",
    name: "Leena Das",
    email: "leena@track.edu",
    role: "athlete",
    event: "Javelin Throw",
    department: "ECE",
    year: "1st Year",
    phone: "+91 90000 10006"
  },
  {
    id: "athlete-4",
    name: "Arjun Nair",
    email: "arjun@track.edu",
    role: "athlete",
    event: "1500m",
    department: "Civil",
    year: "Final Year",
    phone: "+91 90000 10007"
  }
];

export const sportsEvents = ["100m Sprint", "400m Sprint", "1500m", "Long Jump", "Javelin Throw", "Middle Distance"];

export const attendanceRecords = [
  { id: "att-1", athleteId: "athlete-demo", date: "2026-05-24", morning: "Present", evening: "Absent", markedBy: "captain-demo" },
  { id: "att-2", athleteId: "athlete-demo", date: "2026-05-23", morning: "Present", evening: "Present", markedBy: "captain-demo" },
  { id: "att-3", athleteId: "athlete-demo", date: "2026-05-22", morning: "Late", evening: "Present", markedBy: "captain-demo" },
  { id: "att-4", athleteId: "athlete-2", date: "2026-05-24", morning: "Present", evening: "Present", markedBy: "captain-demo" },
  { id: "att-5", athleteId: "athlete-3", date: "2026-05-24", morning: "Absent", evening: "Present", markedBy: "captain-demo" },
  { id: "att-6", athleteId: "athlete-4", date: "2026-05-24", morning: "Late", evening: "Absent", markedBy: "captain-demo" },
  { id: "att-7", athleteId: "athlete-2", date: "2026-05-23", morning: "Present", evening: "Late", markedBy: "captain-demo" },
  { id: "att-8", athleteId: "athlete-3", date: "2026-05-23", morning: "Present", evening: "Present", markedBy: "captain-demo" }
];

export const coachAttendanceRecords = [
  { id: "coach-2026-05-24", date: "2026-05-24", status: "Present", markedBy: "captain-demo" },
  { id: "coach-2026-05-23", date: "2026-05-23", status: "Present", markedBy: "captain-demo" },
  { id: "coach-2026-05-22", date: "2026-05-22", status: "Present", markedBy: "captain-demo" }
];

export const trainingSchedule = [
  { day: "Mon", focus: "Acceleration", time: "6:00 AM" },
  { day: "Wed", focus: "Strength circuit", time: "5:00 PM" },
  { day: "Fri", focus: "Starts and baton work", time: "6:00 AM" }
];
