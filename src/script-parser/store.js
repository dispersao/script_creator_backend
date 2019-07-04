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


  /*let arcCategories = film.categories
    .filter(c => c.type === 'arc')
    .map(cat => {
      return {
        text: cat.text,
        type: cat.type,
        characters_ids: nameToCharId((cat.characters||[]), characters)
      }
    });

  let otherCategories = film.categories.filter(c => c.type !== 'arc').map(c=>({type:c.type, text: ''}));
  otherCategories = uniqBy(otherCategories, 'type');

  entries.categories = otherCategories.concat(arcCategories).map(cat => {
    return app.services.categories.create(cat)
  });

  let categories = await Promise.all(entries.categories);*/

  let sequencesData = film.sequences.map(seq => {
    let mapped = {
      sceneNumber: seq.sceneNumber,
      locationId: locations.find(e => e.name === seq.location).id,
      typeId: types.find(e => e.name === seq.type).id,
      duration: (seq.duration || 0),
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

const mapCategories = (seqCategories, categories, sequences) => {
  return seqCategories.map(scat => {
    const mapedCat = {};
    if(scat.type === 'arc'){
      mapedCat.categoryId = categories.find(cat => cat.text === scat.text).id;
    } else {
      mapedCat.categoryId = categories.find(cat => cat.type === scat.type).id;
      if(scat.type === 'pos'){
        mapedCat.index = scat.text;
      } else {
        mapedCat.relatedSequence = sequences.find(s => s.sceneNumber === scat.text).id;
      }
    }
    return mapedCat;
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
