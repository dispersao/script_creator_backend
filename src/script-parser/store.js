const uniqBy = require('lodash/uniqBy');

const store = async (film, app) => {
  const fields = ['locations', 'characters', 'types'];
  let entries = {};

  fields.forEach(field => {
    entries[field] = film[field].map(entryname => {
      return app.services[field].create({
        name: entryname
      }).catch(e => console.log(e))
    });
  });

  let locations = await Promise.all(entries.locations);
  let types = await Promise.all(entries.types);
  let characters = await Promise.all(entries.characters);
  let sequences = [];


  let arcCategories = film.categories
    .filter(c => c.type === 'arc')
    .map(cat => {
      return {
        text: cat.text,
        type: cat.type,
        characters_ids: nameToCharId((cat.characters||[]), characters)
      }
    });

  let otherCategories = film.categories.filter(c => c.type !== 'arc');
  // let otherCategories = film.categories.filter(c => c.type !== 'arc').map(c=>({type:c.type, text: ''}));
  // otherCategories = uniqBy(otherCategories, 'type');

  entries.categories = arcCategories.concat(otherCategories).map(cat => {
    return app.services.categories.create(cat)
  });

  let categories = await Promise.all(entries.categories);

  let sequencesData = film.sequences.map(seq => {
    let mapped = {
      sceneNumber: seq.sceneNumber,
      locationId: locations.find(e => e.name === seq.location).id,
      typeId: types.find(e => e.name === seq.type).id,
      duration: (seq.duration || 0),
      categories_ids: mapCategories(seq.categories, categories),
      parts: seq.parts.map(p =>({
        index: p.index,
        content: p.content,
        type: p.type,
        characters_ids: nameToCharId(p.characters ||[], characters)
      }))
    }
    return mapped;
  })

  createSeq(sequencesData, 0, app, sequences);
}

const mapCategories = (seqCategories, categories) => {
  return seqCategories.map(scat => {
    const category = categories.find(cat => cat.text.toString() === scat.text.toString() && cat.type === scat.type)

    return category.id;
  });
}

const createSeq = (seqs, index, app, sequences) => {
  app.services.sequences.create(seqs[index])
    .then(el => {
      sequences.push(el);
      if(index < seqs.length - 1){
        createSeq(seqs, index + 1, app, sequences);
      } else {
        // relateCategories(seqs, sequences, app);
      }
    })
    .catch(e => console.log(e))
}

const relateCategories = (seqs, sequences, app) => {
  // let promises = seqs.map(s => {
    //map categories
    // app.services.sequences.
  // })
}

const nameToCharId = (list, characters)=>{
  return list.map(ch => characters.find(cch=> cch.name === ch).id)
}

module.exports = store
