'use strict';

var _ = require('lodash/core'),
    csvParse = require('csv-parse').parse,
    csvParseSync = require('csv-parse/sync').parse,
    csvStringify = require('csv-stringify').stringify,
    csvStringifySync = require('csv-stringify/sync').stringify;

/**
 * @private
 */
function parseCSV(str, options) {
  options = _.extend({}, options, { columns: true });
  return csvParseSync(str, options);
}

/**
 * @private
 */
function toCSV(records, options) {
  options = _.extend({}, options, { header: true });
  return csvStringifySync(records, options);
}

/**
 * @private
 */
function parseCSVStream(options) {
  options = _.extend({}, options, { columns: true });
  return csvParse(options);
}

/**
 * @private
 */
function serializeCSVStream(options) {
  options = _.extend({}, options, { header: true });
  return csvStringify(options);
}


/**
 * @protected
 */
module.exports = {
  parseCSV: parseCSV,
  toCSV: toCSV,
  parseCSVStream: parseCSVStream,
  serializeCSVStream: serializeCSVStream
};
