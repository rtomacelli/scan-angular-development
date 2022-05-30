/**
 * Tests whether a DOM element has a given class.
 *
 * @export
 * @param {Element} element The DOM element to test.
 * @param {string} testClass The class name to look up.
 * @returns {boolean} `true` if the element has the specified class. `false`
 * otherwise.
 *
 * @see https://stackoverflow.com/a/28344281
 */
export function hasClass(element: Element, testClass: string): boolean {
  return !!element.className.match(getClassRegex(testClass));
}

/**
 * Tests whether an SVG DOM element has a given class.
 *
 * @export
 * @param {SVGElement} element The SVG DOM element to test.
 * @param {string} testClass The class name to look up.
 * @returns {boolean} `true` if the element has the specified class. `false`
 * otherwise.
 */
export function svgHasClass(element: SVGElement, testClass: string): boolean {
  return !!(element.className as SVGAnimatedString).baseVal.match(getClassRegex(testClass));
}

/**
 * Adds a class to a DOM element.
 *
 * @export
 * @param {Element} element The element that will receive the new class.
 * @param {string} newClass The name of the new class.
 */
export function addClass(element: Element, newClass: string) {
  if (!hasClass(element, newClass)) {
    element.className += ` ${newClass}`;
  }
}

/**
 * Adds a class to an SVG DOM element.
 *
 * @export
 * @param {Element} element The element that will receive the new class.
 * @param {string} newClass The name of the new class.
 */
export function svgAddClass(element: SVGElement, newClass: string) {
  if (!svgHasClass(element, newClass)) {
    (element.className as SVGAnimatedString).baseVal += ` ${newClass}`;
  }
}

/**
 * Removes a given class from a DOM element.
 *
 * @export
 * @param {Element} element The element from which the class is to be removed.
 * @param {string} oldClass The name of the class to be removed.
 */
export function removeClass(element: Element, oldClass: string) {
  if (hasClass(element, oldClass)) {
    const regex = getClassRegex(oldClass);
    element.className = element.className.replace(regex, ' ');
  }
}

/**
 * Removes a given class from an SVG DOM element.
 *
 * @export
 * @param {Element} element The element from which the class is to be removed.
 * @param {string} oldClass The name of the class to be removed.
 */
export function svgRemoveClass(element: SVGElement, oldClass: string) {
  if (svgHasClass(element, oldClass)) {
    const regex = getClassRegex(oldClass);
    (element.className as SVGAnimatedString).baseVal = (element.className as SVGAnimatedString).baseVal.replace(regex, ' ');
  }
}

/**
 * Creates a regular expression to match the value of a `class` HTML attribute
 * containing a given class name.
 *
 * @param {string} className The class name to match.
 * @returns {RegExp} A regular expression that matches a `class` HTML attribute
 * value containing the given class.
 */
function getClassRegex(className: string): RegExp {
  return new RegExp(`(\\s|^)${className}(\\s|$)`);
}
