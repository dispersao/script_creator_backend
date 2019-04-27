const sequences = require('./sequences/sequences.service.js');
const scripts = require('./scripts/scripts.service.js');
const scriptSequences = require('./script_sequences/script_sequences.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(sequences);
  app.configure(scripts);
  app.configure(scriptSequences);
};
