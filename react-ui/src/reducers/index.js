import { combineReducers } from 'redux';
import sequenceData, { STATE_KEY as SEQUENCE_DATA_STATE_KEY } from './sequenceData';
import scriptData, { STATE_KEY as SCRIPT_DATA_STATE_KEY } from './scriptData';
import sequenceFilters, { STATE_KEY as SEQUENCE_FILTERS_STATE_KEY } from './sequenceFilters';

const reducer = combineReducers({
  [SEQUENCE_DATA_STATE_KEY]: sequenceData,
  [SEQUENCE_FILTERS_STATE_KEY]: sequenceFilters,
  [SCRIPT_DATA_STATE_KEY]: scriptData
});

export default reducer;
