import { combineReducers } from 'redux';
import sequenceData, { STATE_KEY as SEQUENCE_DATA_STATE_KEY } from './sequenceData';
import scriptData, { STATE_KEY as SCRIPT_DATA_STATE_KEY } from './scriptData';
import sequenceFilters, { STATE_KEY as SEQUENCE_FILTERS_STATE_KEY } from './sequenceFilters';
import user, { STATE_KEY as USER_STATE_KEY } from './user';

const reducer = combineReducers({
  [SEQUENCE_DATA_STATE_KEY]: sequenceData,
  [SEQUENCE_FILTERS_STATE_KEY]: sequenceFilters,
  [SCRIPT_DATA_STATE_KEY]: scriptData,
  [USER_STATE_KEY]: user
});

export default reducer;
