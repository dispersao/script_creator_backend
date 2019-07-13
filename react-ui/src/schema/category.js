import { schema } from 'normalizr';
import characterSchema from './character';

const categorySchema = new schema.Entity('categories', {
  characters: [characterSchema]
});

export default categorySchema;
