/**
 * Safely retrieves the value at a given dot-delimited path within an object.
 *
 * @template T
 * @param {T} object
 *   The object from which to retrieve the value.
 * @param {string} path
 *   A dot-notation string describing the nested property path
 *   (e.g. `"user.address.street"`).
 * @returns {*}
 *   The value found at the specified path, or `undefined` if:
 *   - the object is `null`/`undefined`
 *   - the path is an empty string
 *   - any intermediate property along the path does not exist.
 */
export function getValueFromPath<T>(object: T, path: string): unknown {
  if (!object || !path) {
    return;
  }
  // Normalize the path to handle array indices and remove redundant dots
  // Allows for paths "a.b.1.c", "a.b[1].c" and "a.b.[1].c" to be treated the same
  const keys = path
    .replace(/\[(\d+)\]/g, ".$1")
    .replace(/\.{2,}/g, ".")
    .split(".");
  let result = object;
  for (const key of keys) {
    result = result?.[key];
  }
  return result;
}
