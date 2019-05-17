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

const normalizeScriptData = (data) => {
  return normalize(data, scriptsListSchema)
}

export {normalizeScriptData}
