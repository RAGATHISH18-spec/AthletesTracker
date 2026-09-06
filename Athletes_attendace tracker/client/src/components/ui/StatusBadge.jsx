export default function StatusBadge({ status }) {
  const styles = {
    Present: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
    Late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100",
    Absent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200"
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles[status] || styles.Absent}`}>{status}</span>;
}
