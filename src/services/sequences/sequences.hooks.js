const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      function(context) {
        const models = context.app.get('sequelizeClient').models;
        context.params.sequelize = {
          raw: false,
          include: [{ model: models['locations']}, { model: models['types']}, { model: models['parts'], include: [{model: models['characters']}] }]
        };
        return Promise.resolve(context);
      }
  ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
