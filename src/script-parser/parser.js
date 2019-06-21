const fs = require('fs');
const fountain = require('./fountain-master/index');


parseFile = app => {
  if(process.env.PARSE_SCRIPT){
    let fountainFile = __dirname + "/" + process.env.PARSE_SCRIPT;

    fs.readFile(fountainFile, 'utf-8', (err, data) => {
      if(err){
        console.log(err);
      } else {
        const script = data;
        const film = fountain.parse(data, true, processTokens);
        film.sequences.map(({type, location, number}) => ({type, location, number}));
        includeNonDialogueCharsToScenes(film);
        includeSeqTime(film);
        store(film, app);
      }
    });
  }
}

const processTokens = output => {
    const sequences = [];
    const characters = [];
    const types = [];
    const locations = [];
    let sequence;

    output.tokens.forEach(token =>{

      switch(token.type){

        case 'scene_heading':
          sequence = {characters:[], content:'', actions:[], parts: [], categories:[]};
          const type_location = token.text.split('-');
          sequence.type = type_location[0].trim();
          sequence.location = type_location[1].trim();
          sequence.sceneNumber = token.scene_number;

          addUniqueElement(types, sequence.type);
          addUniqueElement(locations, sequence.location);

          sequences.push(sequence);
        break;

        case 'note':
          sequence.categories.push({text: token.text})
        break;

        case 'dialogue_begin':
          sequence.parts.push({index: sequence.parts.length, type: 'dialogue'});
        break;

        case 'character':
          const char = token.text;
          sequence.parts[sequence.parts.length -1].characters = [char];
          addUniqueElement(sequence.characters, char);
          addUniqueElement(characters, char);
        break;

        case 'parenthetical':
          sequence.parts[sequence.parts.length -1].extra = token.text;
        break;

        case 'dialogue':
          sequence.parts[sequence.parts.length -1].content = token.text;
        break;

        case 'action':
          let action = token.text;
          sequence.actions.push(action);
          let type = 'action';
          const regExp = new RegExp("(\\-\\-)(.*)(\\-\\-)", 'gm');
          if(action.match(regExp)){
            type = "observation";
            action = action.replace(regExp, '$2')
          }
          sequence.parts.push({index: sequence.parts.length, type: type , content: action});
        break;
      }
      if(sequence && token.text != undefined && token.type !== 'scene_heading'){
        sequence.content+= token.text + '<br />';
      }
    });
    return {sequences: sequences, characters: characters, types: types, locations: locations};
}

const includeNonDialogueCharsToScenes = (film) => {
  film.sequences.forEach(sequence => {
    sequence.parts
    .filter(part => part.type === 'action')
    .forEach(actionPart => {
      actionPart.characters = [];
      film.characters.forEach(char => {
        const reg = new RegExp(`\\b${char}\\b(?!\\|)`, 'gmi');
        if(actionPart.content.match(reg)){
          addUniqueElement(sequence.characters, char, true);
          addUniqueElement(actionPart.characters, char, true);
        }
      });
    });
  });
}

const store = async (film, app) => {

  const fields = ['locations', 'characters', 'types'];
  let entries = {};

   fields.forEach(field => {
     entries[field] = film[field].map((entryname, index) => {
        let entry = { name: entryname };
        return app.services[field].create({
          name: entryname
        })
        .then(e => {
          console.log(e)
          return e
        })
        .catch(e => console.log(e))
      });
  });

  let locations = await Promise.all(entries.locations)
  let types = await Promise.all(entries.types)
  let characters = await Promise.all(entries.characters)

  let sequencesData = film.sequences.map(seq => {
    let mapped = {
      sceneNumber: seq.sceneNumber,
      locationId: locations.find(e => e.name === seq.location).id,
      typeId: types.find(e => e.name === seq.type).id,
      parts: seq.parts.map(p =>({
        index: p.index,
        content: p.content,
        type: p.type,
        characters_ids: (p.characters ||[]).map(ch => characters.find(cch=> cch.name === ch).id)
      }))
    }
    return mapped;
  })

  createSeq(sequencesData, 0, app)
}

const createSeq = (seqs, index, app) => {
  console.log(seqs[index])
  app.services.sequences.create(seqs[index])
  .then(el => {
    console.log(el)
    if(index < seqs.length - 1){
      createSeq(seqs, index + 1, app)
    } else {
      console.log('end of crations')
    }
  })
  .catch(e => console.log(e))
}

const addUniqueElement = (chars, char, log) => {
  if(!chars.includes(char)){
    chars.push(char);
  }
}

const includeSeqTime = (film)=>{
  let videosFilder = __dirname + "/" + process.env.VIDEOS_FOLDER;

}

module.exports = {
  parseFile: parseFile
}
