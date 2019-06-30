// Initializes the `parts` service on path `/parts`
const createService = require('feathers-sequelize');
const createModel = require('../../models/part.model');
const hooks = require('./parts.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/parts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('parts');

  service.hooks(hooks);
};
