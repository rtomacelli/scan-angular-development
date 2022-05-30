import { DynamicDialogConfig } from 'primeng/api';

export const WIDTH_FACTOR = 1.75;
export const HEIGHT_FACTOR = 3;
export const BASE_Z_INDEX = 1002;

export const DEFAULT_WIDTH = 100 - WIDTH_FACTOR;
export const DEFAULT_HEIGHT = 100 - HEIGHT_FACTOR;

/**
 * Builds a configuration object for a PrimeNG `DynamicDialog`.
 *
 * @export
 * @param {number} [level] The nesting level for the new `DynamicDialog`.
 * @returns {DynamicDialogConfig} A new `DynamicDialog` configuration object.
 */
export function getDynamicDialogConfig(level?: number): DynamicDialogConfig {
  level = (level && level > 0) ? level : 1; // clamp the level at 1
  return {
    width: `${getDynamicDialogWidth(level)}%`,
    height: `${getDynamicDialogHeight(level)}%`,
    baseZIndex: getDynamicDialogZIndex(level)
  };
}

/**
 * Gets the width (in pixels) for a PrimeNG `DynamicDialog`, for a given
 * nesting level.
 *
 * @export
 * @param {number} level The target nesting level.
 * @returns The appropriate width (in pixels) for the given nesting level.
 */
export function getDynamicDialogWidth(level: number) {
  return 100 - (WIDTH_FACTOR * level);
}

/**
 * Gets the height (in pixels) for a PrimeNG `DynamicDialog`, for a given
 * nesting level.
 *
 * @export
 * @param {number} level The target nesting level.
 * @returns The appropriate height (in pixels) for the given nesting level.
 */
export function getDynamicDialogHeight(level: number) {
  return 100 - (HEIGHT_FACTOR * level);
}

/**
 * Gets the z-index for a PrimeNG `DynamicDialog`, for a given nesting level.
 *
 * @export
 * @param {number} level The target nesting level.
 * @returns The appropriate z-index for the given nesting level.
 */
function getDynamicDialogZIndex(level: number): number {
  return BASE_Z_INDEX + level;
}
