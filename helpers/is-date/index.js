const YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])' + // [1] year
  '-([0-9][0-9]?)' + // [2] month
  '-([0-9][0-9]?)' + // [3] day
  '(?:[Tt]|[ \\t]+)' + // ...
  '([0-9][0-9]?)' + // [4] hour
  ':([0-9][0-9])' + // [5] minute
  ':([0-9][0-9])' + // [6] second
  '(?:\\.([0-9]*))?' + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
    '(?::([0-9][0-9]))?))?$' // [11] tz_minute
)

const YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])' + // [1] year
  '-([0-9][0-9])' + // [2] month
    '-([0-9][0-9])$' // [3] day
)

/**
 * Checks if a string looks like a date
 *
 * Lifted verbatim from the js-yaml
 *
 * @see {@link https://github.com/nodeca/js-yaml/blob/master/dist/js-yaml.js#L3822|js-yams implementation}
 * @param {string} data A date or timestamp string
 */
module.exports = data => {
  if (data === null) {
    return false
  }

  if (YAML_DATE_REGEXP.exec(data) !== null) {
    return true
  }

  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) {
    return true
  }

  return false
}
