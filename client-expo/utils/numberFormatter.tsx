function formatNumber(number: number): string {
  const numberString = number.toString();
  const parts = numberString.split('.');
  const integerPart = parts[0];

  // Format the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  // If there is a decimal part, include it in the result
  const formattedNumber = parts.length === 1 ? formattedInteger : `${formattedInteger}.${parts[1]}`;

  return formattedNumber;
}

export default formatNumber;
