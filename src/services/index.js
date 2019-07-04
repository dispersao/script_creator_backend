const sequences = require('./sequences/sequences.service.js');
const scripts = require('./scripts/scripts.service.js');
const scriptSequences = require('./script_sequences/script_sequences.service.js');
const users = require('./users/users.service.js');
const types = require('./types/types.service.js');
const locations = require('./locations/locations.service.js');
const characters = require('./characters/characters.service.js');
const parts = require('./parts/parts.service.js');
const categories = require('./categories/categories.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(sequences);
  app.configure(scripts);
  app.configure(scriptSequences);
  app.configure(users);
  app.configure(types);
  app.configure(locations);
  app.configure(characters);
  app.configure(parts);
  app.configure(categories);
};
