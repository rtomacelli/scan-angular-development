import { isNumber } from 'util';

import { UserAttribute, UserAttributeLine, UserAttributes } from '@models/admin';
import { REMOTE_ROUTES } from '@routes/remote.routes';

/**
 * Redirects to the login page.
 *
 * @export
 */
export function scanLogin() {
  document.location.href = REMOTE_ROUTES.login;
}

/**
 * Redirects to the logout page.
 *
 * @export
 */
export function scanLogout() {
  document.location.href = REMOTE_ROUTES.logout;
}

/**
 * Emits a message and redirects to the logout page.
 *
 * TODO Redirect to a proper component, where the user might be able to
 * refresh their session.
 *
 * @export
 * @param {string} message
 */
export function alertAndLogout(message: string) {
  alert(message);
  scanLogout();
}

/**
 * Retrieves the value of the named cookie.
 *
 * @private
 * @param {string} name The name of the cookie.
 * @returns The value of the named cookie, if found; `undefined` otherwise.
 *
 * @memberOf AuthenticationService
 */
export function getCookie(name: string) {
  return document.cookie.split('; ').filter(c => c.startsWith(`${name}=`)).map(c => c.split('=')[1])[0];
}

/**
 * Parses the SSO response and formats it as a `UserAttributes` object.
 *
 * @param {string} response The SSO response to be parsed.
 * @returns {UserAttributes} The parsed object.
 */
export function formatUserAttributes(response: string): UserAttributes {
  const lines = response.split('\n');
  const token = extractUserToken(lines);
  const roles = extractUserRoles(lines);
  const attributes = extractUserAttributes(lines);

  return parseUserAttributes(token, roles, attributes);
}

/**
 * Finds and extracts the SSO token from an array of user attribute strings.
 *
 * @param {string[]} lines An array of user attribute strings.
 * @returns {string} The token, if found; an empty string otherwise.
 */
function extractUserToken(lines: string[]): string {
  const tokenLine = lines.filter(line => line.startsWith('userdetails.token'));
  return tokenLine.length > 0 ? tokenLine[0].split('=')[1] : '';
}

/**
 * Finds and extracts the user's roles from an array of user attribute
 * strings.
 *
 * @param {string[]} lines An array of user attribute strings.
 * @returns {string[]} An array of user roles, if any are found; an
 * empty array otherwise.
 */
function extractUserRoles(lines: string[]): string[] {
  const roleLines = lines.filter(line => line.startsWith('userdetails.role'));
  return roleLines.length > 0 ? roleLines.map(role => role.split('=')[2].split(',')[0]) : [];
}

/**
 * Finds ans extracts a user's attributes from an array of user attribute
 * strings.
 *
 * @param {string[]} lines An array of user attribute strings.
 * @returns {UserAttributeLine[]} An array of (column, content) pairs of user
 * attribute lines, if found; an empty array otherwise.
 */
function extractUserAttributes(lines: string[]): UserAttributeLine[] {
  const attributes = lines.filter(line => line.startsWith('userdetails.attribute'));
  return attributes.length > 0 ? attributes.map(line => parseUserAttributeLine(line)) : [];
}

/**
 * Parses an attribute line and extracts its column name and content.
 *
 * @param {string} line The attribute line.
 * @returns {UserAttributeLine} The (column, content) pair extracted.
 */
function parseUserAttributeLine(line: string): UserAttributeLine {
  const pair = line.split('=');
  const column = pair[0].split('.').reverse()[0];
  pair.shift();
  return { column: column, content: pair.join('=') };
}

/**
 * Parses the attributes from an array of user attributes and assembles a
 * JSON representation of them, along with the token and roles.
 *
 * @param {string} token The user's token.
 * @param {string[]} roles An array of roles assigned to the user.
 * @param {UserAttributeLine[]} attributes An array of (column, content) pairs.
 * @returns {UserAttributes} A JSON representation of the user's attributes.
 */
function parseUserAttributes(token: string, roles: string[], attributes: UserAttributeLine[]): UserAttributes {
  const result: UserAttributes = { token: token, roles: roles };

  let i = 0;
  while (i < attributes.length) {
    if (attributes[i].column === 'name') {
      const name = attributes[i].content;
      [i, result[name]] = findUserAttributeValues(attributes, i);
    }
  }

  return result;
}

/**
 * Finds one or more values for the attribute named at the given index of an
 * array of of user attribute lines ((column, content) pairs).
 *
 * @param {UserAttributeLine[]} attributes A list of user attribute lines.
 * @param {number} index The starting index for the search.
 * @returns {[number, UserAttribute]} The index for the next search and the next index.
 */
function findUserAttributeValues(attributes: UserAttributeLine[], index: number): [number, UserAttribute] {
  const value: UserAttribute = [];
  let j: number;
  for (j = index + 1; attributes[j] && attributes[j].column === 'value'; j++) {
    const content = attributes[j].content;
    value.push(isNumber(content) ? +content : content);
  }
  return [j, value.length === 1 ? value[0] : value];
}
