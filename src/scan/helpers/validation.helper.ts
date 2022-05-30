export interface ValidityCondition {
  'isValid': boolean;
  'invalidMessage': string;
}

/**
 * Determines whether a set of validity conditions has any invalid occurrences
 * and builds an appropriate error message.
 *
 * @export
 * @param {ValidityCondition[]} conditions A set of validity conditions, each
 * with an error message in case they are invalid.
 * @param {boolean} [showCount=false] Whether to add a total of invalid
 * conditions to the final error message.
 * @returns {string} An error message with all the invalid conditions'
 * messages, if any, concatenated at the end, optionally with the invalid
 * count. An empty string in case all conditions are valid.
 */
export function validateData(conditions: ValidityCondition[], showCount: boolean = false): string {
  const invalidConditions = conditions.filter(condition => !condition.isValid);
  const errorCount = invalidConditions.length;
  const s = errorCount > 1 ? 's' : '';

  const errorMessages = invalidConditions.map(condition => condition.invalidMessage);
  const errorCountText = showCount ? `${errorCount} erro${s}` : `Erro${s}`;

  return errorCount !== 0
    ? `${errorCountText} na carga dos dados: ${errorMessages.join('; ')}`
    : '';
}
