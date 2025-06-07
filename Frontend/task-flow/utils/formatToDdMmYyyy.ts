export default function formatToDdMmYyyy (dateStringYyyyMmDd: string): string {
  if (!dateStringYyyyMmDd || !dateStringYyyyMmDd.includes('-')) {
    return dateStringYyyyMmDd; 
  }
  const parts = dateStringYyyyMmDd.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStringYyyyMmDd;
};