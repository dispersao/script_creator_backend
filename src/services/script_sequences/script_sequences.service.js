// Initializes the `script_sequences` service on path `/script-sequences`
const createService = require('feathers-sequelize');
const createModel = require('../../models/scriptsequence.model');
const hooks = require('./script_sequences.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/script_sequences', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('script_sequences');

  service.hooks(hooks);
};
