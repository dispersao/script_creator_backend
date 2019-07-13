import { fromJS, List } from 'immutable'

import {
  SET_FILTER_IDS,
  SET_FILTER_EXCLUDE,
  SET_FILTER_AND
} from '../actions'

export const STATE_KEY = 'sequenceFilters'


const createDefaultFilter = ()=> ({
  ids:[],
  exclude:false
})

const filtersDefault = {
  characters:{
    ...createDefaultFilter(),
    and: true
  },
  types: createDefaultFilter(),
  locations: createDefaultFilter(),
  arc: createDefaultFilter(),
  pos: createDefaultFilter()
}

const initialFilterState = fromJS(filtersDefault);

const reducer = (state = initialFilterState, action) => {
  switch(action.type){
    case SET_FILTER_IDS:
      const idsList = List(action.payload.value)
      return state.setIn([action.payload.name, action.payload.field], idsList)
    case SET_FILTER_EXCLUDE:
    case SET_FILTER_AND:
      return state.mergeDeep({
        [action.payload.name]: {
          [action.payload.field]: action.payload.value
        }
      })
    default:
      return state
  }
}

export default reducer
