export function flattenObjectValues(nestedObject: any) {
  // Extract all values from the object (e.g. arrays associated with each key)
  const values = Object.values(nestedObject);

  // Use flat(Infinity) to flatten any nested arrays at any depth
  const flattened = values.flat(Infinity);

  return flattened;
}
