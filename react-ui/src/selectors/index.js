import { Map } from 'immutable';
import { createSelector } from 'reselect';

// Select entities from state
const getSequences = state => state.sequenceData.get('sequences')
const getParts = state => state.sequenceData.get('parts')
const getCharacters = state => state.sequenceData.get('characters')
const getLocations = state => state.sequenceData.get('locations')
const getTypes = state => state.sequenceData.get('types')

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

const memoizedCharacters = createSelector(
  getSequenceCharacters,
  chars => chars
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
  getScriptSequences,
  ( sequences, parts, characters, locations, types, filters, scripts, currentScript, scriptSeqs) => {
    if (!sequences || sequences.size === 0) return null;
    let filtered = (
      sequences
        .sort((a, b) => a.get('id') < b.get('id') ? -1 : (a.get('id') > b.get('id') ? 1 : 0))
        .filter((sequence) => {

          return filters.keySeq().toArray().every( filterName => {
            let field;
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
            }
            return field && filterField(filters.get(filterName), field)
          }) && !scripts
                .getIn([currentScript.toString(), 'sequences'])
                .some(sid => sid === sequence.get('id'))
        })
        .map((sequence) => mountSequence(sequence, types, locations, parts, characters))
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
    (scriptId, scripts, scriptSequences, sequences, parts, characters, locations, types) => {
      if(!scriptId || !scripts || !sequences || sequences.size === 0) return null
      const script = scripts.get(scriptId.toString())
      return Map({
        name: script.get('name'),
        id: script.get('id'),
        author: script.get('author'),
        last_editor: script.get('last_editor'),
        synched: script.get('synched'),
        new: script.get('new'),
        // sequences: script.get('scriptSequences').map((scriptSeqId, index) => {
        sequences: script.get('sequences').map((seqId, index) => {
          // const scriptSeq = scriptSequences.get(scriptSeqId.toString())
          let seq = sequences.get(seqId.toString())
          return mountSequence(seq, types, locations, parts, characters)
          // return seq.set('index', scriptSeq.get('index'))
        })
      })
    }
  )

// }

const mountSequence = (sequence, types, locations, parts, characters) => {
  return Map({
    id: sequence.get('id'),
    type: types.get(sequence.get('type').toString()),
    location: locations.get(sequence.get('location').toString()),
    characters: memoizedCharacters(sequence, parts).map(charId => characters.get(charId.toString())),
    sceneNumber: sequence.get('sceneNumber'),
    parts: sequence.get('parts').map(partId => {
      let p = parts.get(partId.toString())
      let caracters = p.get('characters').map(charId => characters.get(charId.toString()))
      return p.set('characters', caracters)
    })
  })
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
  getScriptsLoading
};
