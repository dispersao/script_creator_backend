const fs = require('fs');
const fountain = require('./fountain-master/index');
const padStart = require('lodash/padStart');
const isNaN = require('lodash/isNaN');
const ffmpeg = require('ffmpeg');


const parseFile = async (app) => {
  if(process.env.PARSE_SCRIPT){
    let fountainFile = __dirname + '/' + process.env.PARSE_SCRIPT;

    fs.readFile(fountainFile, 'utf-8', async (err, data) => {
      if(err){
        console.log(err);
      } else {
        const film = fountain.parse(data, true, processTokens);
        film.sequences.map(({type, location, number}) => ({type, location, number}));
        includeNonDialogueCharsToScenes(film);
        film.sequences = await includeSeqTime(film.sequences);
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
        type = 'observation';
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

  return

  fields.forEach(field => {
    entries[field] = film[field].map(entryname => {
      return app.services[field].create({
        name: entryname
      }).catch(e => console.log(e))
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
      duration: (seq.duration || 0),
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
  app.services.sequences.create(seqs[index])
  .then(el => {
    if(index < seqs.length - 1){
      createSeq(seqs, index + 1, app)
    } else {
      console.log('-----end of parsing------')
    }
  })
  .catch(e => console.log(e))
}

const addUniqueElement = (chars, char, log) => {
  if(!chars.includes(char)){
    chars.push(char);
  }
}

const includeSeqTime = async (seqs)=>{
  let videosFolder = __dirname + '/' + process.env.VIDEOS_FOLDER;

  let promises = seqs.map(seq => {
    let padCount = isNaN(Number(seq.sceneNumber.slice(-1))) ? 4 : 3;
    let fileName = padStart(seq.sceneNumber, padCount, '0');
    let videoFile = `${videosFolder}/${fileName}.mov`;

    let p;
    try{
      let process = new ffmpeg(videoFile);
      p = process.then(video => {
        video.fnExtractFrameToJPG(`${videosFolder}/photos`, {
          frame_rate : 1,
          start_time: 5,
          number : 1,
          file_name : `${fileName}`
        }, (error, files) => {
          if(error) console.log(error)
          else console.log(files)
        })
        return video.metadata.duration.seconds
      }).catch(e => {
        console.dir(seq.sceneNumber, e)
      })
    } catch(e){
      console.log(seq.sceneNumber, e)
    }
    return p;
  })
  let seconds = await Promise.all(promises)
  seqs.forEach((s,index) => {
    if(seconds[index]){
      s.duration = seconds[index]
    }
  })

  return seqs;
}

module.exports = {
  parseFile: parseFile
}
