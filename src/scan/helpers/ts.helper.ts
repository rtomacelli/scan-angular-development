import { Deserializable } from '@models/common';

/**
 * Deserializes an array that may or may not be present in a JSON source.
 *
 * @export
 * @template T The type of the array members.
 * @param {*} source The JSON source.
 * @param {string} key The key to the array in the JSON source.
 * @param {new() => T} type A class of the required type.
 * @returns {T[]} The deserialized array, or an empty one in case it was not
 * present.
 */
export function deserializeArray<T extends Deserializable>(source: any, key: string, type: new() => T): T[] {
  if (!!source[key] && source[key].length > 0) {
    return source[key].map((e: any) => new type().deserialize(e));
  } else {
    return [];
  }
}
