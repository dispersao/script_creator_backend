// Initializes the `scripts` service on path `/scripts`
const createService = require('feathers-sequelize');
const createModel = require('../../models/scripts.model');
const hooks = require('./scripts.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/scripts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('scripts');

  service.hooks(hooks);
};
