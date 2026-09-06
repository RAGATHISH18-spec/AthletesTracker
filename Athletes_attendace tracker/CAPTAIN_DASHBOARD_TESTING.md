# Captain Dashboard - Testing Checklist

## Test Environment
- Login: captain@track.edu / training123
- Test Date: 2026-06-13 (Friday)
- Expected 7-day period: 2026-06-07 to 2026-06-13

## Button Functionality Tests

### 1. "Mark attendance" Button
- [ ] Button is visible and clickable
- [ ] Navigates to /attendance page
- [ ] Can mark sessions for athletes
- [ ] Can save attendance records

### 2. "Export CSV" Button  
- [ ] Button is visible and clickable (green color)
- [ ] Download icon displays correctly
- [ ] Triggers CSV download with filename: attendance_YYYY-MM-DD.csv
- [ ] CSV file opens in spreadsheet application

## CSV Export Format Verification

### CSV Structure
- [ ] First row contains headers: Date, Name, Department, Morning, Evening
- [ ] Data rows contain records from last 7 days only
- [ ] All columns properly populated
- [ ] Department field correctly mapped to athlete department
- [ ] Morning/Evening status values: Present, Absent, Late

### Example CSV Content
```
Date,Name,Department,Morning,Evening
2026-06-13,Ananya Rao,Computer Science,Present,Absent
2026-06-13,Kabir Singh,IT,Present,Present
2026-06-12,Leena Das,ECE,Absent,Present
```

## Data Filtering Tests

### 7-Day Window Verification
- [ ] No records dated before 2026-06-07 (6 days ago)
- [ ] All records dated on/before 2026-06-13 (today)
- [ ] No future dates appear
- [ ] Tomorrow's date (2026-06-14) is not included

### Table Display Tests
- [ ] Attendance table shows only last 7 days
- [ ] Records sorted by date (newest first)
- [ ] Department column displays for all athletes
- [ ] No empty/null department values

## Unwanted Buttons Removal Tests

### Stat Cards Grid
- [ ] Shows exactly 3 cards (not 4)
- [ ] "Reports Ready" card is REMOVED
- [ ] Remaining cards: Athletes | This Week | Attendance
- [ ] "Today's Entries" renamed to "This Week"
- [ ] "All sessions" changed to "Last 7 days" in Attendance card

### Navigation
- [ ] No other unwanted buttons visible
- [ ] Only "Mark attendance" and "Export CSV" buttons in header
- [ ] No extra action buttons in table

## Data Accuracy Tests

### Statistics Calculation
- [ ] Athletes count is correct
- [ ] "This Week" count matches today's records
- [ ] Attendance percentage calculated from last 7 days
- [ ] Stats update when new records are marked

## Chart Verification
- [ ] Attendance chart displays data from last 7 days only
- [ ] Chart shows Present, Late, Absent bars
- [ ] No future dates in chart

## Responsive Design Tests
- [ ] Buttons display correctly on mobile
- [ ] Table scrolls horizontally on small screens
- [ ] CSV export works on all devices
- [ ] Layout responsive on tablet/desktop

## Dark Mode Tests
- [ ] All elements properly themed
- [ ] Text readable in dark mode
- [ ] Button colors appropriate for dark mode

## Error Handling
- [ ] No console errors on page load
- [ ] CSV export handles empty data gracefully
- [ ] Special characters in names handled correctly in CSV
- [ ] Navigation works without errors

## Performance Tests
- [ ] Page loads within 2 seconds
- [ ] CSV export completes quickly
- [ ] No performance degradation with large datasets
