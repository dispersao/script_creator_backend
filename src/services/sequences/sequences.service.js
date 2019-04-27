// Initializes the `sequences` service on path `/api/sequences`
const createService = require('feathers-sequelize');
const createModel = require('../../models/sequence.model');
const hooks = require('./sequences.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sequences', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('/sequences');

  service.hooks(hooks);
};
