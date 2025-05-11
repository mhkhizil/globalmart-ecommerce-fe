export function maskInput(input: string) {
  // If the input contains an "@" we assume it is an email.
  if (input.includes('@')) {
    // Ensure the email is long enough to apply the mask.
    if (input.length < 7) return input;
    // Take the first three characters.
    const visibleStart = input.slice(0, 3);
    // Always reveal the last four characters (i.e. ".com")
    const visibleEnd = input.slice(-4);
    // Calculate how many characters to mask.
    const maskLength = input.length - 7; // 7 = 3 (start) + 4 (".com")
    const masked = '*'.repeat(maskLength);
    return visibleStart + masked + visibleEnd;
  } else {
    // For non-email strings, we show only the first three and last two characters.
    if (input.length < 5) return input;
    const visibleStart = input.slice(0, 3);
    const visibleEnd = input.slice(-2);
    const maskLength = input.length - 5; // 5 = 3 (start) + 2 (end)
    const masked = '*'.repeat(maskLength);
    return visibleStart + masked + visibleEnd;
  }
}
