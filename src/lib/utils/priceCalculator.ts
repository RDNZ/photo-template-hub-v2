export const calculateOrderPrice = (
  softwareType: string,
  turnaroundTime: string,
  hasDarkroomFile: boolean = false
): number => {
  // Base price starts at 0
  let basePrice = 0;

  // Add turnaround time fee
  const turnaroundFees = {
    "3d": 15,
    "2d": 20,
    "1d": 25,
    "12h": 30,
  };

  // Add turnaround fee to base price
  basePrice += turnaroundFees[turnaroundTime as keyof typeof turnaroundFees] || 0;

  // Add darkroom file fee if applicable
  if (softwareType === "darkroom_booth_3" && hasDarkroomFile) {
    basePrice += 10;
  }

  return basePrice;
};