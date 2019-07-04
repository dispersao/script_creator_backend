const fs = require('fs');
const fountain = require('./fountain-master/index');
const includeSeqTime = require('./video_process');
const processCategories = require('./category_processor');
const uniqBy = require('lodash/uniqBy');
const uniq = require('lodash/uniq');
const difference = require('lodash/difference');
const store = require('./store');


const parseFile = async (app) => {
  if(process.env.PARSE_SCRIPT){
    let fountainFile = __dirname + '/' + process.env.PARSE_SCRIPT;

    fs.readFile(fountainFile, 'utf-8', async (err, data) => {
      if(err){
        console.log(err);
      } else {
        const film = fountain.parse(data, true, processTokens);
        film.sequences.map(({type, location, number}) => ({type, location, number}));
        includeCharacters(film);
        film.sequences = await includeSeqTime(film.sequences);
        store(film, app);
      }
    });
  }
}

const processTokens = output => {
  let sequences = [];
  let characters = [];
  let types = [];
  let locations = [];
  let categories = [];
  let sequence;

  let type_location, action, char, type;
  const regExp = new RegExp('(\\-\\-)(.*)(\\-\\-)', 'gm');

  output.tokens.forEach(token =>{

    switch(token.type){

    case 'scene_heading':
    console.log(token);
      sequence = {characters:[], content:'', actions:[], parts: [], categories:[]};
      type_location = token.text.split('-');
      sequence.type = type_location[0].trim();
      sequence.location = type_location[1].trim();
      sequence.sceneNumber = token.scene_number;

      types = addUniqueElement(types, sequence.type);
      locations = addUniqueElement(locations, sequence.location);

      sequences.push(sequence);
      break;

    case 'note':
      sequence.categories = addUniqueElement(sequence.categories, processCategories(token, categories), 'text');
      categories = addUniqueElement(categories, sequence.categories, 'text');
      break;


    case 'dialogue_begin':
      sequence.parts.push({index: sequence.parts.length, type: 'dialogue'});
      break;

    case 'character':
      char = token.text;
      sequence.parts[sequence.parts.length -1].characters = [char];
      sequence.characters = addUniqueElement(sequence.characters, char);
      characters = addUniqueElement(characters, char);
      break;

    case 'parenthetical':
      sequence.parts[sequence.parts.length -1].extra = token.text;
      break;

    case 'dialogue':
      sequence.parts[sequence.parts.length -1].content = token.text;
      break;

    case 'action':
      action = token.text;
      sequence.actions.push(action);
      type = 'action';
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
  return {
    sequences,
    characters,
    types,
    locations,
    categories
  };
}

const includeCharacters = (film) => {
  film.sequences.forEach(s => {
    let partsToAddChars = s.parts.filter(p => p.type === 'action');
    const otherParts = difference(s.parts, partsToAddChars);
    partsToAddChars = addCharacters(partsToAddChars, film.characters, 'content');
    s.parts = otherParts.concat(otherParts, partsToAddChars);
  })


  let categoriesToAddChars = film.categories.filter(cat => cat.type === 'arc')
  const otherCategories = difference(film.categories, categoriesToAddChars);
  categoriesToAddChars = addCharacters(categoriesToAddChars, film.characters, 'text');
  film.categories = categoriesToAddChars.concat(otherCategories);
}

const addCharacters = (elements, characters, field) => {
  return elements.map(el => {
    el.characters = [];
    characters.forEach(char => {
      const reg = new RegExp(`\\b${char}\\b(?!\\|)`, 'gmi');
      if(el[field].match(reg)){
        el.characters = addUniqueElement(el.characters, char);
      }
    })
    return el;
  })
}

const addUniqueElement = (list, el, field) => {
  if(Array.isArray(el)){
    list = list.concat(el);
  } else {
    list.push(el);
  }
  if(field){
    return uniqBy(list, field);
  } else{
    return uniq(list);
  }
}


module.exports = {
  parseFile: parseFile
}
