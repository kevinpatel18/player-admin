export function formatIndianNumber(num) {
  // Convert to string and split by decimal point
  const [integerPart, decimalPart] = num.toString().split(".");

  // Add commas to integer part
  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  // Combine everything
  return otherNumbers
    ? `${formatted},${lastThree}${decimalPart ? "." + decimalPart : ""}`
    : `${lastThree}${decimalPart ? "." + decimalPart : ""}`;
}
