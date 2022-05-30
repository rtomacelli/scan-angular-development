/**
 * Extends an object with the attributes of one or more other objects.
 *
 * @export
 * @param {...any[]} args The extended object and any number of extending objects.
 * @returns {*} The extended object.
 * @see https://stackoverflow.com/a/11197343
 * @see https://jsfiddle.net/1vrkw1pc/
 */
export function extend<T>(...args: T[]): T {
  for (let i = 1; i < args.length; i++) {
    for (const key in args[i]) {
      if (args[i].hasOwnProperty(key)) {
        if (typeof args[0][key] === 'object' && typeof args[i][key] === 'object') {
          extend(args[0][key], args[i][key]);
        } else {
          args[0][key] = JSON.parse(JSON.stringify(args[i][key]));
        }
      }
    }
  }
  return args[0];
}

/**
 * Clones an object.
 *
 * @export
 * @param {*} object The object to be cloned.
 * @returns {*} A clone of the passed object.
 */
export function clone(object: any): any {
  return extend({}, object);
}

/**
 * Flattens an array of arrays.
 *
 * @export
 * @template T The type of the array elements.
 * @param {T[][]} array The array of arrays to be flattened.
 * @returns {T[]} The flattened array.
 */
export function flatten<T>(array: T[][]): T[] {
  return Array.prototype.concat.apply([], array) as T[];
}

/**
 * Sorts an array and removes duplicates.
 *
 * @export
 * @template T The type of the array elements.
 * @param {T[]} array The array to be simplified.
 * @param {(a: T, b: T) => number} [compareFn] An optional comparison function.
 * @returns {T[]} The simplified array.
 */
export function deduplicate<T>(array: T[], compareFn?: (a: T, b: T) => number): T[] {
  return array.sort(compareFn).filter((e, i, a) => {
    if (!!compareFn) {
      return !i || compareFn(e, a[i - 1]) !== 0;
    } else {
      return !i || e !== a[i - 1];
    }
  });
}

/**
 * Compares two (possibly nested) arrays of **primitive** values to determine
 * whether their contents are equal.
 *
 * TODO Add support for arrays of `Object`.
 *
 * @export
 * @param {any[]} a The first array to be compared.
 * @param {any[]} b The second array to be compared.
 * @returns {boolean} `true` if both arguments are defined, are arrays, have
 * equal lengths, and have equal content; `false` otherwise.
 */
export function compareArrays(a: any[], b: any[]): boolean {
  if ([a, b].filter(array => !!array && Array.isArray(array)).length !== 2) { // Both must be arrays
    console.warn('js.helper.ts::compareArrays(): Invalid arguments:', [a, b]);
    return false;
  }
  if (a.length !== b.length) { return false; } // Both lengths should match

  for (const i in a) {
    if (Array.isArray(a[i]) && Array.isArray(b[i])) {
      if (!compareArrays(a[i], b[i])) { return false; }
    } else if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Formats a byte quantity to make it more legible. For instance,
 * 123,456,789 GB would become 123.45 EB.
 *
 * @export
 * @param {number} value The original value.
 * @param {string} order The order of the original value, e.g. 'GB'.
 * @param {boolean} binary Whether the division should be binary or decimal.
 * @param {number} [precision=2] The precision to use in the conversion.
 * @returns {string} The formatted quantity.
 */
export function formatBytes(value: number, order: string, binary?: boolean, precision: number = 2): string {
  const byteSuffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const binaryFactor = 1024;
  const decimalFactor = 1000;

  const factor = binary ? binaryFactor : decimalFactor;
  let power = (!!order && byteSuffixes.includes(order)) ? byteSuffixes.indexOf(order) : 0;
  let quotient: number;

  for (quotient = value; quotient >= factor; quotient /= factor) { power++; }
  return `${quotient.toFixed(precision)} ${byteSuffixes[power]}`;
}

/**
 * Formats a percentage into a user-friendly string.
 *
 * @export
 * @param {number} percentage The original value to format.
 * @param {number} [precision=2] The number of digits after the decimal point.
 * @returns {string} The formatted string.
 */
export function formatPercentage(percentage: number, precision: number = 2): string {
  return `${parseFloat(percentage.toFixed(precision)).toLocaleString()}%`;
}

/**
 * Determines whether an object represents a numeric value. Based on the
 * implementation of JQuery's `isNumeric` method.
 *
 * @export
 * @param {*} obj The object to be tested.
 * @returns {boolean} `true` if the object represents a numeric value.
 * `false` otherwise.
 *
 * @see https://github.com/jquery/jquery/blob/bf48c21d225c31f0f9b5441d95f73615ca3dcfdb/src/core.js#L206
 */
export function isNumeric(obj: any): boolean {
  return !Array.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}

/**
 * Converts a `Date` object to the date portion of its ISO string
 * representation.
 *
 * @export
 * @param {Date} date The date to convert.
 * @returns {string} The converted date.
 */
export function toISODateString(date: Date): string {
  return (!!date && !!date.toISOString) ? date.toISOString().split('T')[0] : undefined;
}

/**
 * Splits a string containing a list by an optionally given separator and
 * returns the corresponding string array.
 *
 * @export
 * @param {string} list The string containing the list.
 * @param {string} [separator=','] The optional separator, comma by default.
 * @returns {string[]} An array of the list string elements.
 */
export function splitStringList(list: string, separator = ','): string[] {
  if (!!list && list.length > 0) {
    return list.split(separator);
  }
  return [];
}

export function arraySum(array: number[]): number {
  return array.reduce((s, v) => s + v, 0);
}
