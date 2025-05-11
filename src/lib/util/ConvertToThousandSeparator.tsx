export function convertThousandSeparator(
  targetValue: number,
  noOfDecimalPlaces: number
) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: noOfDecimalPlaces,
    maximumFractionDigits: noOfDecimalPlaces,
  }).format(targetValue);
}
