export function formatDate(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const day = String(date.getDate()).padStart(2, '0'); // 01-31
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
  const year = String(date.getFullYear()).slice(-2); // Last 2 digits

  return `${day}/${month}/${year}`;
}
