// Initializes the `locations` service on path `/locations`
const createService = require('feathers-sequelize');
const createModel = require('../../models/location.model');
const hooks = require('./locations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/locations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('locations');

  service.hooks(hooks);
};