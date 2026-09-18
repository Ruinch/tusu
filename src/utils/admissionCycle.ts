export const getEarliestTargetYear = () => new Date().getFullYear() + 1;

export function getDeadlineForTargetYear(deadline: string, label: string, targetYear: number) {
  const sourceYear = Number(deadline.slice(0, 4));
  const yearOffset = targetYear - sourceYear;

  return {
    date: `${targetYear}${deadline.slice(4)}`,
    label: label.replace(/\b(20\d{2})\b/g, (year) => String(Number(year) + yearOffset))
  };
}
