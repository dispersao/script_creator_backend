const dehydrate = require('feathers-sequelize/hooks/dehydrate');

module.exports = {
  before: {
    all: [function(context) {
      const models = context.app.get('sequelizeClient').models;
      context.params.sequelize = {
        raw: false,
        include: [{ model: models['script_sequences'], as:'script_sequences'}]
      };
      return Promise.resolve(context);
    }],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      dehydrate(),
      function (context){
        context.result.data = context.result.data.map(formatScriptResponse)
        return context
      }
    ],
    get: [
      dehydrate(),
      function (context){
        context.result = formatScriptResponse(context.result);
        return context;
      }
    ],
    create: [
      prepareInputData,
      createSequenceScript,
      formatScript
    ],
    update: [
      prepareInputData,
      deleteSequenceScripts,
      updateSequenceScript,
      createSequenceScript,
      formatScript
    ],
    patch: [
      prepareInputData,
      deleteSequenceScripts,
      updateSequenceScript,
      createSequenceScript,
      formatScript
    ],
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


function formatScriptResponse(script) {
  const {id, name, author} = script
  return {
    id,
    name,
    author,
    sequences: script.script_sequences.sort((a,b)=>{
      return a.index < b.index ? -1 : 1;
    })
    .map(ss=>ss.sequenceId)
  };
}

function prepareInputData(context){
  context.data.sequences = (context.data.sequences || []).map((sequenceId, index) => {
    return {
      sequenceId,
      index
    }
  });
  return context;
}

async function deleteSequenceScripts(context){
  const toDelete = (context.result.script_sequences||[]).filter(seq =>{
    return context.data.sequences.every(s=> s.sequenceId !== seq.sequenceId)
  });

  await Promise.all(toDelete.map(seq=>{
    return context.app.services['script_sequences'].remove(seq.id);
  }));

  return context
}

async function updateSequenceScript(context){
  const toUpdate = context.data.sequences.filter(seq =>{
    const dbSs = (context.result.script_sequences||[]).find(s => {
      return s.sequenceId === seq.sequenceId && s.index !== seq.index
    });

    if(dbSs){
      seq.id = dbSs.id;
      return true;
    }
});

  await Promise.all(toUpdate.map(seq => {
    return context.app.services['script_sequences'].patch(seq.id, {
      index: seq.index
    });
  }));

  return context;
}

async function createSequenceScript(context){
  const toCreate = (context.data.sequences).filter(seq =>{
    return context.result.script_sequences.every(s=> s.sequenceId !== seq.sequenceId)
  });


  await Promise.all(toCreate.map(seq => {
    return context.app.services['script_sequences'].create({
      ...seq,
      scriptId: context.result.id
    });
  }));

  return context;
}

async function formatScript(context){
  context.result = await context.app.services['scripts'].get(context.result.id);
  return context;
}
