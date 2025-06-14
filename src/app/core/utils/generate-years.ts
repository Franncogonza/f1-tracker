export function generateYears(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => end - i);
}
