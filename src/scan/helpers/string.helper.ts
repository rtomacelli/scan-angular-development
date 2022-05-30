import { ORGCHART_URL } from '@routes/remote.routes';

interface TextLine { type: string; heading?: string; text?: string; items?: TextLine[]; }
const lower = 'a-z\u00C0-\u00D6\u00D8-\u00DE';
const upper = 'A-Z\u00DF-\u00F6\u00F8-\u00FF';
const alpha = `${lower}${upper}`;

/**
 * Removes accents and diacritics from a string.
 *
 * @export
 * @param {string} text The text to be altered.
 * @returns {string} The text without accents and diacritics.
 *
 * @see https://stackoverflow.com/a/37511463
 */
export function removeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Converts a text string to one usable as an identifier in code.
 *
 * @export
 * @param {string} text The text to be converted.
 * @param {string} [separator] The word separator to be used (default: '-').
 * @returns {string} The converted identifier.
 */
export function textToIdentifier(text: string, separator: string = '-'): string {
  return removeDiacritics(text.trim()).toLocaleLowerCase().replace(/[^a-z0-9]+/g, (separator || '-'));
  // return removeDiacritics(text).replace(/[ \-&:\/(),.!?@#$%*\[\]+]+/g, '_').toLocaleLowerCase();
}

/**
 * Converts a text string to title case.
 *
 * @export
 * @param {string} text The text to be converted.
 * @returns {string} The converted text.
 */
export function capitalize(text: string): string {
  const exceptions = ['a', 'ante', 'até', 'após', 'com', 'contra', 'de',
    'desde', 'em', 'entre', 'para', 'por', 'perante', 'sem', 'sob',
    'sobre', 'trás', 'à', 'às', 'as', 'ao', 'aos', 'o', 'os', 'do',
    'dos', 'da', 'das', 'no', 'nos', 'na', 'nas', 'pelo', 'pelos',
    'pela', 'pelas', 'que', 'e', 'com', 'mas'];
  const words = text.split(' ');

  return words.map((word, i) => (!i || !exceptions.includes(word.toLocaleLowerCase()))
    ? word.replace(/^./, c => c.toLocaleUpperCase())
    : word.toLocaleLowerCase()
  ).join(' ');
}

/**
 * Converts the first letter of a word to uppercase, the rest to lowercase.
 *
 * @export
 * @param {string} word The word to be converted.
 * @returns {string} The converted word.
 */
export function capitalizeWord(word: string): string {
  return word.toLocaleLowerCase().replace(/^./, c => c.toLocaleUpperCase());
}

/**
 * Formats a text string of documentation as HTML, parsing any detected
 * microformats.
 *
 * @export
 * @param {string} documentation The documentation to be formatted.
 * @returns {string} The formatted text.
 */
export function formatDocumentation(documentation: string): string {
  let lines: TextLine[] = [];
  if (documentation && documentation.length > 0) {
    lines = breakLines(documentation, 80).map(line => detectMicroformat(line));
  }
  const formatted = formatTextLines(lines);
  return formatted;
}

/**
 * Breaks a string of text in lines of a fixed character width.
 *
 * @param {string} text The text to be broken in lines.
 * @param {number} lineLength The required line length.
 * @returns An array of lines.
 */
function breakLines(text: string, lineLength: number) {
  const regExp = new RegExp(`.{1,${lineLength}}`, 'g');
  return text.match(regExp);
}

/**
 * Detects microformats in a line of text and marks this line with its
 * corresponding type.
 *
 * @param {string} line The line whose microformats are to be detected.
 * @returns {TextLine} The marked line.
 */
// tslint:disable: max-line-length
function detectMicroformat(line: string): TextLine {
  const references = [
    'Vide ',
    'Criado (?:em|por):? ',
    '(?:Última\\s)?[Aa]tualização:? ',
    'Atualizado (?:em|por):? ',
    'Alteração ',
    'Alterado (?:em|por):? ',
    'Sigla (?:criada|atualizada|desativada) (?:em|por):? ',
    'Retirada .* (?:em|por):? '
  ].join('|');
  const tags = ['Número - Título', 'Original', 'De', 'Para'].join('|');

  const h3     = new RegExp(`^[${upper}\\s]{4,}\\s?(?:\\([${alpha}\\s\\(\\)0-9-]+\\))?:$`); // Heading:        4+ UPPERCASE or "(" or ")" or space, optional ":"
  const h4     = new RegExp(`^[${upper}\\s]+$`);                                            // Subheading:     UPPERCASE or space
  const h4p    = new RegExp(`^(?:- )?([${upper}]{2,3}?)(?:: ?| - )(.*)$`);                  // App reference:  optional "- ", ($1: app code), ": " or " - ", ($2: text)
  const h5p    = new RegExp(`^(?:- )?([${alpha}\\s]+)\\.+:\\s*?(.*)$`, 'i');                // Observation:    optional "- ", ($1: words), 1+ ".", ":", 0+ space, ($2: text)
  const br     = new RegExp('^\\.$');                                                       // Blank line:     "."
  const ref    = new RegExp(`^((?:${references}).*\\d+.*)$`, 'i');                          // Reference:      reference, anything, 1+ digits, anything
  const liUl   = new RegExp('^-\\s*');                                                      // Bullet list:    starts with "-" and 0+ space
  const liUlUl = new RegExp('^[\\.\\+](?!\\.)\\s*');                                        // Bullet sublist: starts with "." or "+" not followed by ".", then 0+ space
  const liOl   = new RegExp('^[(]?\\d+\\s?[-\\.)] ?');                                      // Number list:    starts with either "(digits) " or "digits - " or "digits. "
  const liOlA  = new RegExp('^[(]?[a-z]{1}\\s?[-\\.)](?!\\d) ?');                           // Letter list:    starts with wither "(letter) " or "letter - " or "letter. "
  const mail   = new RegExp(`^(${tags})[ ]+:[ ]+(.*)$`);                                    // Mail:           ($1: Tag), 1+ spaces, ":", 1+ spaces, ($2: text)

  line = line.trim();

  if (line.length > 0) {
    if (h3.test(line))     {                                  return { type: 'h3',                        text: line                     }; } else
    if (h4.test(line))     {                                  return { type: 'h4',                        text: line                     }; } else
    if (h4p.test(line))    { const matches = h4p.exec(line);  return { type: 'h4',   heading: matches[1], text: matches[2]               }; } else
    if (h5p.test(line))    { const matches = h5p.exec(line);  return { type: 'h5',   heading: matches[1], text: matches[2]               }; } else
    if (br.test(line))     {                                  return { type: 'br'                                                        }; } else
    if (ref.test(line))    { const matches = ref.exec(line);  return { type: 'em',                        text: matches[1]               }; } else
    if (liUl.test(line))   {                                  return { type: 'li-ul',                     text: line.replace(liUl, '')   }; } else
    if (liUlUl.test(line)) {                                  return { type: 'li-ul-ul',                  text: line.replace(liUlUl, '') }; } else
    if (liOl.test(line))   {                                  return { type: 'li-ol',                     text: line.replace(liOl, '')   }; } else
    if (liOlA.test(line))  {                                  return { type: 'li-ol-a',                   text: line.replace(liOlA, '')  }; } else
    if (mail.test(line))   { const matches = mail.exec(line); return { type: 'mail', heading: matches[1], text: matches[2]               }; } else {
      return { type: 'p', text: line };
    }
  } else {
    return { type: 'br' };
  }
}
// tslint:enable: max-line-length

/**
 * Formats an array of marked lines as the corresponding HTML.
 *
 * @param {TextLine[]} textLines The marked lines to be formatted.
 * @returns {string} The HTML representation.
 */
function formatTextLines(textLines: TextLine[]): string {
  let formatted: TextLine[] = [];

  formatted = joinParagraphs(textLines);
  formatted = joinParagraphsWithHeadings(formatted);
  formatted = joinBulletItems(formatted);
  formatted = joinBulletSubitems(formatted);
  formatted = joinNumberItems(formatted);
  formatted = joinLetterItems(formatted);
  formatted = joinLineBreaks(formatted);

  parseText(formatted);

  formatted = parseOrderedLists(formatted);
  formatted = parseOrderedLists(formatted, 'a');
  formatted = parseOrderedListSublists(formatted);
  formatted = parseUnorderedLists(formatted);
  formatted = parseUnorderedListSublists(formatted);

  return buildHTMLText(formatted);
}

/**
 * Converts an array of type-marked text lines to the corresponding HTML
 * representation.
 *
 * @param {TextLine[]} lines The array of type-marked lines to be converted.
 * @returns {string} The HTML representation of those lines.
 */
function buildHTMLText(lines: TextLine[]): string {
  return lines.map(line => buildHTMLElement(line)).join('');
}

/**
 * Builds the HTML representation of a type-marked text line.
 *
 * @param {TextLine} line The line to be converted.
 * @returns {string} The line's HTML representation.
 */
function buildHTMLElement(line: TextLine): string {
  switch (line.type) {
    case 'h3': return buildHeading(line);
    case 'h4': return buildHeading(line);
    case 'h5': return buildHeading(line);
    case 'br': return '<br>';
    case 'em': return `<p><em>${line.text}</em></p>`;
    case 'ul': return `<ul>${buildListItems(line.items)}</ul>`;
    case 'ol': return `<ol class="numbers">${buildListItems(line.items)}</ol>`;
    case 'ol-a': return `<ol class="letters">${buildListItems(line.items)}</ol>`;
    case 'mail': return `<p class="mail">${line.text}</p>`;
    case 'p': return `<p>${line.text}</p>`;
    default: throw new Error(`Invalid line type "${line.type}"`);
  }
}

/**
 * Builds the HTML representation of a heading line.
 *
 * @param {TextLine} line The heading line.
 * @returns {string} The line's HTML representation.
 */
function buildHeading(line: TextLine): string {
  if (!!line.heading) {
    return `<${line.type}>${line.heading}</${line.type}><p>${line.text}</p>`;
  } else {
    return `<${line.type}>${line.text}</${line.type}>`;
  }
}

/**
 * Builds the HTML representation of a list's items.
 *
 * @param {TextLine[]} items The list of items.
 * @returns {string} The list's HTML representation.
 */
function buildListItems(items: TextLine[]): string {
  return items.map(item => {
    let text = '<li>';
    if (['li-ul', 'li-ul-ul', 'li-ol', 'li-ol-a'].includes(item.type)) {
      text += item.text;
    } else {
      throw new Error(`Invalid item type "${item.type}"`);
    }
    if (item.items && item.items.length > 0) {
      text += `<ul>${buildListItems(item.items)}</ul>`;
    }
    text += '</li>';
    return text;
  }).join('');
}

/**
 * Parses an array of type-marked lines to perform substitutions.
 *
 * @param {TextLine[]} lines The lines to be parsed.
 */
function parseText(lines: TextLine[]) {
  lines.forEach(line => {
    if (line.text) {
      line.text = line.text
        .replace(new RegExp(`([${alpha}])-\\s+([${alpha}])`, 'g'), '$1$2') // Join hyphenated words
        .replace(/ - /g, ' &mdash; ')                                      // Replace spaced dashes with M-dashes
        .replace(/^\*\*\s+/, '')                                           // Remove initial "** "
        .replace(/\s+\/\s+/g, '/')                                         // Remove spaces from around slashes
        .replace(/\s+([\.:])/g, '$1')                                      // Remove spaces from before periods and colons
        .replace(/(https?:\/\/\S+)/g, '<br><a href="$1">$1</a><br>')       // Make links for URLs
        .replace(/([FC][0-9]{7})/gi, (_match, uid) => {                    // Make user profile links for UIDs
          uid = uid.toLocaleUpperCase();
          return `<a href="${ORGCHART_URL}/${uid}" target="humanograma">${uid}</a>`;
        });
      return line;
    }
  });
}

/**
 * Parses lists of ordered items in an array of type-marked lines: creates
 * ordered lists with those items nested inside.
 *
 * @param {TextLine[]} lines The lines to check for ordered lists.
 * @param {string} [listStyleType] Optional list style type.
 * @returns {TextLine[]} The lines with parsed ordered lists.
 */
function parseOrderedLists(lines: TextLine[], listStyleType?: string): TextLine[] {
  const type = 'li-ol' + (!!listStyleType ? `-${listStyleType}` : '');
  let i = 0;
  while (i < lines.length) {
    if (lines[i].type === type) {
      const startOfList: boolean = (!i && lines[i].type === type) || lines[i - 1].type !== type;
      if (startOfList) {
        const ol: TextLine = { type: type.replace('li-', ''), items: [] };
        let j = i;
        while (j < lines.length && lines[j].type === type) {
          if (lines[j].text.length > 0) {
            ol.items.push(JSON.parse(JSON.stringify(lines[j])));
            lines[j].text = '';
          }
          j++;
        }
        lines[i] = ol;
        i = j;
      }
    }
    i++;
  }
  return pruneText(lines);
}

/**
 * Parses sublists of ordered items in an array of type-marked lines: creates
 * ordered lists with those sublists nested inside.
 *
 * @param {TextLine[]} lines The lines to check for ordered list sublists.
 * @returns {TextLine[]} The lines with parsed ordered list sublists.
 */
function parseOrderedListSublists(lines: TextLine[]): TextLine[] {
  const formatted: TextLine[] = [];
  let i = 0;
  while (i < lines.length) {
    const line: TextLine = JSON.parse(JSON.stringify(lines[i]));
    if (lines[i].type.startsWith('ol-') && lines[i + 1] && lines[i + 1].type === 'li-ul') {
      const lastLi = line.items[line.items.length - 1];
      const items: TextLine[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].type === 'li-ul') {
        if (lines[j].text.length > 0) {
          items.push(JSON.parse(JSON.stringify(lines[j])));
        }
        j++;
      }
      lastLi.items = items;
      formatted.push(line);
      i = j;
    } else {
      formatted.push(line);
      i++;
    }
  }
  return formatted;
}

/**
 * Parses lists of unordered items in an array of type-marked lines: creates
 * unordered lists with those items nested inside.
 *
 * @param {TextLine[]} lines The lines to check for unordered lists.
 * @returns {TextLine[]} The lines with parsed unordered lists.
 */
function parseUnorderedLists(lines: TextLine[]): TextLine[] {
  const type = 'li-ul';
  let i = 0;
  while (i < lines.length) {
    if (lines[i].type === type) {
      const startOfList: boolean = (!i || lines[i].type === type) || lines[i - 1].type !== type;
      if (startOfList) {
        const ul: TextLine = { type: 'ul', items: [] };
        let j = i;
        while (j < lines.length && lines[j].type === type) {
          if (lines[j].text.length > 0) {
            ul.items.push(JSON.parse(JSON.stringify(lines[j])));
            lines[j].text = '';
          }
          j++;
        }
        lines[i] = ul;
        i = j;
      }
    }
    i++;
  }
  return pruneText(lines);
}

/**
 * Parses sublists of unordered items in an array of type-marked lines:
 * creates unordered lists with those sublists nested inside.
 *
 * @param {TextLine[]} lines The lines to check for unordered list sublists.
 * @returns {TextLine[]} The lines with parsed unordered list sublists.
 */
function parseUnorderedListSublists(lines: TextLine[]): TextLine[] {
  const formatted: TextLine[] = [];
  let i = 0;
  while (i < lines.length) {
    const line: TextLine = JSON.parse(JSON.stringify(lines[i]));
    if (lines[i].type === 'ul' && lines[i + 1] && lines[i + 1].type === 'li-ul-ul') {
      const lastLi = line.items[line.items.length - 1];
      const items: TextLine[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].type === 'li-ul-ul') {
        if (lines[j].text.length > 0) {
          items.push(JSON.parse(JSON.stringify(lines[j])));
        }
        j++;
      }
      lastLi.items = items;
      formatted.push(line);
      i = j;
    } else {
      formatted.push(line);
      i++;
    }
  }
  return formatted;
}

/**
 * Removes blanked out lines from a list of type-marked text lines.
 *
 * @param {TextLine[]} lines The array of lines to be pruned.
 * @returns {TextLine[]} The pruned lines.
 */
function pruneText(lines: TextLine[]): TextLine[] {
  return lines.filter(line => {
    return ['ul', 'ol', 'ol-a', 'br'].includes(line.type) || line.text.length > 0;
  });
}

/**
 * Joins consecutive paragraph lines into a single paragraph.
 *
 * @param {TextLine[]} lines Lines whose paragraph lines are to be joined.
 * @returns {TextLine[]} Lines with joined paragraphs.
 */
function joinParagraphs(lines: TextLine[]): TextLine[] {
  return joinLines(lines, 'p', 'p');
}

/**
 * Joins consecutive paragraph lines into a single paragraph.
 *
 * @param {TextLine[]} lines Lines whose paragraph lines are to be joined.
 * @returns {TextLine[]} Lines with joined paragraphs.
 */
function joinParagraphsWithHeadings(lines: TextLine[]): TextLine[] {
  return joinLines(lines, 'p', 'h4');
}

/**
 * Joins paragraph lines following unordered list items into those list
 * items.
 *
 * @param {TextLine[]} lines Lines whose long unordered list items are to be
 * joined.
 * @returns {TextLine[]} Lines with joined unordered list items.
 */
function joinBulletItems(lines: TextLine[]): TextLine[] {
  return joinLines(lines, 'p', 'li-ul');
}

/**
 * Joins paragraph lines following unordered sublist items into those sublist
 * items.
 *
 * @param {TextLine[]} lines Lines whose long unordered sublist items are to
 * be joined.
 * @returns {TextLine[]} Lines with joined unordered sublist items.
 */
function joinBulletSubitems(lines: TextLine[]): TextLine[] {
  return joinLines(lines, 'p', 'li-ul-ul');
}

/**
 * Joins paragraph lines following ordered list items into those list
 * items.
 *
 * @param {TextLine[]} lines Lines whose long ordered list items are to be
 * joined.
 * @returns {TextLine[]} Lines with joined ordered list items.
 */
function joinNumberItems(lines: TextLine[]): TextLine[] {
  return joinLines(lines, 'p', 'li-ol');
}

/**
 * Joins paragraph lines following ordered alphabetic list items into those
 * list items.
 *
 * @param {TextLine[]} lines Lines whose long ordered list items are to be
 * joined.
 * @returns {TextLine[]} Lines with joined ordered list items.
 */
function joinLetterItems(lines: TextLine[]): TextLine[] {
  return joinLines(lines, 'p', 'li-ol-a');
}

/**
 * Joins consecutive line breaks.
 *
 * @param {TextLine[]} lines Lines whose line breaks are to be joined.
 * @returns {TextLine[]} Lines with joined line breaks.
 */
function joinLineBreaks(lines: TextLine[]): TextLine[] {
  return joinLines(lines, 'br', 'br');
}

/**
 * Joins consecutive lines of a type into a preceding one of another type.
 *
 * @param {TextLine[]} lines Lines whose lines are to be joined.
 * @param {string} ofType The type to be merged.
 * @param {string} toType The type to be merged into.
 * @returns {TextLine[]} The lines with merged line sequences.
 */
function joinLines(lines: TextLine[], ofType: string, toType: string): TextLine[] {
  const formatted: TextLine[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].type === toType) {
      const joined = JSON.parse(JSON.stringify(lines[i]));
      let j = i + 1;
      while (j < lines.length && lines[j].type === ofType) {
        joined.text += ` ${lines[j].text}`;
        j++;
      }
      formatted.push(joined);
      i = j - 1;
    } else {
      formatted.push(JSON.parse(JSON.stringify(lines[i])));
    }
    i++;
  }
  return formatted;
}

/**
 * Adds an optional word break after every regular expression match.
 *
 * @export
 * @param {string} text The text to which the word breaks should be added.
 * @param {RegExp} [regex=/(\W)/g] The regex to use. The default one targets
 * non-word characters.
 * @returns {string} The original text with optional word breaks added.
 */
export function addOptionalLineBreaks(text: string, regex: RegExp = /(\W)/g): string {
  return text.replace(regex, '$1<wbr>');
}

/**
 * Strips diacritics and non-word prefixes from a string of text to
 * facilitate alphabetic sorting.
 *
 * @export
 * @param {string} text The text.
 * @param {RegExp} [regex=/^\W{0,}/] A `RegExp` representing characters to
 * remove from the label. The default removes non-word characters from the
 * beginning of the label.
 * @returns The formatted text.
 */
export function formatSortableText(text: string, regex: RegExp = /^\W{0,}/) {
  return removeDiacritics(text).replace(regex, '');
}
