/**
 * Export attendance data to CSV format with proper Excel formatting
 * Format: date, name, department, morning, evening
 */
export function exportAttendanceToCSV(records, athletes, filename = "attendance_report.csv") {
  // Get athlete details by ID
  const getAthlete = (athleteId) => athletes.find((a) => a.id === athleteId) || {};

  // CSV header
  const headers = ["Date", "Name", "Department", "Morning", "Evening"];
  const csvContent = [headers.join(",")];

  // Add records with proper formatting
  records.forEach((record) => {
    const athlete = getAthlete(record.athleteId);
    const row = [
      record.date || "",
      athlete.name || "Unknown",
      athlete.department || "N/A",
      record.morning || "N/A",
      record.evening || "N/A"
    ];
    // Properly escape all fields for Excel compatibility
    const escapedRow = row.map((field) => {
      const fieldStr = String(field);
      // Escape quotes and wrap in quotes if contains comma, quotes, or newline
      if (fieldStr.includes(",") || fieldStr.includes('"') || fieldStr.includes("\n")) {
        return `"${fieldStr.replace(/"/g, '""')}"`;
      }
      return fieldStr;
    });
    csvContent.push(escapedRow.join(","));
  });

  // Create blob with UTF-8 BOM for better Excel compatibility
  const csv = csvContent.join("\r\n");
  // Add UTF-8 BOM to ensure Excel recognizes encoding properly
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Export coach attendance data to CSV format with proper Excel formatting
 * Format: date, status
 */
export function exportCoachAttendanceToCSV(records, filename = "coach_attendance_report.csv") {
  const headers = ["Date", "Status"];
  const csvContent = [headers.join(",")];

  records.forEach((record) => {
    const row = [record.date || "", record.status || "N/A"];
    const escapedRow = row.map((field) => {
      const fieldStr = String(field);
      if (fieldStr.includes(",") || fieldStr.includes('"') || fieldStr.includes("\n")) {
        return `"${fieldStr.replace(/"/g, '""')}"`;
      }
      return fieldStr;
    });
    csvContent.push(escapedRow.join(","));
  });

  const presentCount = records.filter((record) => record.status === "Present").length;
  const absentCount = records.filter((record) => record.status === "Absent").length;
  csvContent.push("");
  csvContent.push(`Total Present Days,${presentCount}`);
  csvContent.push(`Total Absent Days,${absentCount}`);

  const csv = csvContent.join("\r\n");
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
