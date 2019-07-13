const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      function(context) {
        const models = context.app.get('sequelizeClient').models;
        context.params.sequelize = {
          raw: false,
          include: [{ model: models['categories'], include: [{model: models['characters']}]}, { model: models['locations']}, { model: models['types']}, { model: models['parts'], include: [{model: models['characters']}] }]
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
    create: [createParts, associateCategories],
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

async function associateCategories(context){
  if(context.data.categories_ids){
    let promises = context.result.setCategories(context.data.categories_ids).catch(e=> console.log(e))

    await Promise.all([promises])
  }
  return context
}

async function createParts(context){
  let promises = context.result.parts.map(p =>{
    return p.setCharacters(context.data.parts[p.index].characters_ids).catch(e=> console.log(e))
  })

  await Promise.all(promises)
  return context
}
