import { schema } from 'normalizr';
import { normalize } from 'normalizr';
import characterSchema from './character';
import categorySchema from './category';

// Define a users schema

const locationSchema = new schema.Entity('locations');

const typeSchema = new schema.Entity('types');

// Define your comments schema
const partSchema = new schema.Entity('parts', {
  characters: [characterSchema]
});

// Define your article
const sequenceSchema = new schema.Entity('sequences', {
  location: locationSchema,
  type: typeSchema,
  parts: [partSchema],
  categories: [categorySchema]
});

const sequencesListSchema = [sequenceSchema];

const normalizeSequencesData = data => normalize(data, sequencesListSchema);

export {normalizeSequencesData, sequenceSchema};
