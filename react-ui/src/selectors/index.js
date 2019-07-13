import { Map } from 'immutable'
import { createSelector } from 'reselect'

// Select entities from state
const getSequences = state => state.sequenceData.get('sequences')
const getParts = state => state.sequenceData.get('parts')
const getCharacters = state => state.sequenceData.get('characters')
const getLocations = state => state.sequenceData.get('locations')
const getTypes = state => state.sequenceData.get('types')
const getCategories = state => state.sequenceData.get('categories')

const getScripts = state => state.scriptData.get('scripts')
const getCurrentScriptId = (state) => state.scriptData.get('currentScript')
const getScriptSequences = state => state.scriptData.get('scriptSequences')

// Select filter from state
const getSequenceFilters = state => state.sequenceFilters;
const getEntryListByname = (state, name) => state.sequenceData.get(name)
const getSequenceFilterByName = (state, name) => state.sequenceFilters.get(name)

const getLogedUser = (state) => state.user
const getScriptsLoading = (state) => state.scriptData.get('loading')

const getSequenceCharacters = (sequence, parts) => {
  let chars = sequence.get('parts').map(pid => parts.get(pid.toString()).get('characters'))
  chars = chars.flatMap(c => c.valueSeq().toArray())
  return chars.toSet().toList()
}

const getCategoryName = (state, props)=> props.name
const  getCategoryListByType = createSelector(
  getCategories,
  getCategoryName,
  (categories, name) => {
    if(!categories || categories.size === 0 || !name){
      return
    }
    return categories
      .filter(cat => cat.get('type') === name)
      .map(cat => (Map({
        id: cat.get('id'),
        name: cat.get('text')
      })))
  }
)


const memoizedCharacters = createSelector(
  getSequenceCharacters,
  chars => chars
)

const getScriptsWithDuration = createSelector(
  getScripts,
  getSequences,
  (scripts, sequences) => {
    if(scripts && sequences){
      return scripts.map(scr => {
        let duration = scr.get('sequences').reduce((ac, s) => ac + sequences.get(s.toString()).get('duration'))
        duration = duration || 0
        return scr.set('duration', duration.toString().toHHMMSS())
      })
    }
  }
)

const getFilteredSequences = createSelector(
  getSequences,
  getParts,
  getCharacters,
  getLocations,
  getTypes,
  getSequenceFilters,
  getScripts,
  getCurrentScriptId,
  getCategories,
  ( sequences, parts, characters, locations, types, filters, scripts, currentScript, categories) => {
    if (!sequences || sequences.size === 0) return null;
    let filtered = (
      sequences
        .sort((a, b) => a.get('id') < b.get('id') ? -1 : (a.get('id') > b.get('id') ? 1 : 0))
        .filter((sequence) => {

          return filters.keySeq().toArray().every( filterName => {
            let field
            switch(filterName){
              case 'characters':
                field = memoizedCharacters(sequence, parts)
                break
              case 'locations':
                field = [sequence.get('location')]
                break
              case 'types':
                field = [sequence.get('type')]
                break
              case 'arc':
                field = sequence.get('categories').filter(c => categories.get(c.toString()).get('type') === 'arc').toSet().toList()
                break
              case 'pos':
                field = sequence.get('categories').filter(c => categories.get(c.toString()).get('type') === 'pos').toSet().toList()
                break
            }
            return field && filterField(filters.get(filterName), field)
          }) && !scripts
            .getIn([currentScript.toString(), 'sequences'])
            .some(sid => sid === sequence.get('id'))
        })
        .map((sequence) => mountSequence(sequence, types, locations, parts, characters, categories))
    )
    return filtered.valueSeq().toList()
  }
)

// const makeGetScriptFormatted = () => {
  // return createSelector(
const getCurrentScriptFormatted = createSelector(
  getCurrentScriptId,
  getScripts,
  getScriptSequences,
  getSequences,
  getParts,
  getCharacters,
  getLocations,
  getTypes,
  getCategories,
  (scriptId, scripts, scriptSequences, sequences, parts, characters, locations, types, categories) => {
    if(!scriptId || !scripts || !sequences || sequences.size === 0) return null
    const script = scripts.get(scriptId.toString())
    return Map({
      name: script.get('name'),
      id: script.get('id'),
      author: script.get('author'),
      last_editor: script.get('last_editor'),
      synched: script.get('synched'),
      new: script.get('new'),
      duration: (script.get('sequences').reduce((ac, s) => ac + sequences.get(s.toString()).get('duration'))||0).toString().toHHMMSS(),
      sequences: script.get('sequences').map((seqId) => {
        let seq = sequences.get(seqId.toString())
        return mountSequence(seq, types, locations, parts, characters, categories)
      })
    })
  }
  )

// }

const mountSequence = (sequence, types, locations, parts, characters, categories) => {
  return Map({
    id: sequence.get('id'),
    type: types.get(sequence.get('type').toString()),
    location: locations.get(sequence.get('location').toString()),
    characters: memoizedCharacters(sequence, parts).map(charId => characters.get(charId.toString())),
    sceneNumber: sequence.get('sceneNumber'),
    duration: sequence.get('duration').toString().toHHMMSS(),
    categories: sequence.get('categories').map(catId => {
      let cat = categories.get(catId.toString())
      let chars = cat.get('characters').map(charId => characters.get(charId.toString()))
      return cat.set('characters', chars)
    }),
    parts: sequence.get('parts').map(partId => {
      let p = parts.get(partId.toString())
      let caracters = p.get('characters').map(charId => characters.get(charId.toString()))
      return p.set('characters', caracters)
    })
  })
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if(hours === '00'){
      return minutes+':'+seconds;
    } else {
      return hours+':'+minutes+':'+seconds
    }
}



const filterField =  (filter, field) => {
  const filterIds = filter.get('ids')
  if(!filterIds.size) return true

  let shouldInclude = true
  if(filter.get('and')){
    shouldInclude = filterIds.every(id => field.includes(id))
  } else {
    shouldInclude = filterIds.some(id => field.includes(id))
  }
  if(filter.get('exclude')){
    shouldInclude = !shouldInclude
  }
  return shouldInclude
}

export {
  getLogedUser,
  getCharacters,
  getLocations,
  getParts,
  getFilteredSequences,
  getSequenceFilterByName,
  getEntryListByname,
  getScripts,
  getSequences,
  getCurrentScriptId,
  getCurrentScriptFormatted,
  getScriptsLoading,
  getScriptsWithDuration,
  getCategoryListByType
}
