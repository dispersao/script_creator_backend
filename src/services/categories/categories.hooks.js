const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [ authenticate('jwt'), formatQuery ],
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
    create: [associateCharacters],
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

function formatQuery(context){
  const models = context.app.get('sequelizeClient').models;
  context.params.sequelize = {
    raw: false,
    include: [{model: models['characters']}]
  };
  return Promise.resolve(context);
}

async function associateCharacters(context){
  if(context.data.characters_ids){
    let promises = context.result.setCharacters(context.data.characters_ids).catch(e=> console.log(e))

    await Promise.all([promises])
  }
  return context
}
