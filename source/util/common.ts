/**
 * Checks if the passed value is null
 * @param val
 * @returns true if val is null, false otherwise
 */
export function isNull<T>(val: T | null): val is null {
  return val === null;
}

/**
 * Checks if the passed value is undefined
 * @param val
 * @returns true if val is undefined, false otherwise
 */
export function isUndefined<T>(val: T | undefined): val is undefined {
  return typeof val === 'undefined';
}

/**
 * Checks if the passed value is null or undefined
 * @param val
 * @returns true if val is null or undefined, false otherwise
 */
export function isNullOrUndefined<T>(
  val: T | null | undefined
): val is null | undefined {
  return isUndefined(val) || isNull(val);
}

/**
 * Checks if the passed value is a string
 * @param val
 * @returns true if val is a string, false otherwise
 */
export function isString<T>(val: T | string): val is string {
  return typeof val === 'string';
}
