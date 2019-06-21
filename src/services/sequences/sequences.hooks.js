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
    create: [createParts],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [errorCreateHandler],
    update: [],
    patch: [],
    remove: []
  }
};

async function createParts(context){
  let promises = context.result.parts.map((p, i)=>{
    return p.setCharacters(context.data.parts[p.index].characters_ids)
      .then(e => {
        console.log(context.data.parts[p.index])
        console.log(e)
      })
      .catch(e=> console.log(e))
  })

  const filledPromises = await Promise.all(promises)

  return context
}

function errorCreateHandler(data){
  console.log(data)
}
