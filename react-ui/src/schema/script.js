import { schema } from 'normalizr'
import { normalize } from 'normalizr'
// import { sequenceSchema } from './sequence'

// const scriptSequenceSchema = new schema.Entity('scriptSequences', {
//   sequence: sequenceSchema
// });

const scriptSchema = new schema.Entity('scripts', {
  // scriptSequences: [scriptSequenceSchema]
});

const scriptsListSchema = [scriptSchema]

const normalizeScriptList = (data) => {
  return normalize(data, scriptsListSchema)
}

const normalizeScript = (data) => {
  return normalize(data, scriptSchema)
}

export {
  normalizeScriptList,
  normalizeScript
}
