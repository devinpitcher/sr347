export function chance(x: number): boolean {
  if (x < 0 || x > 100) {
    throw new Error("The percentage must be between 0 and 100.");
  }

  return Math.random() * 100 < x;
}
