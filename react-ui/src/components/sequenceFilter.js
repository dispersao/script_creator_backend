import React from 'react'
import {connect} from 'react-redux'
import {setFilterIds, setFilterExclude, setFilterAnd} from '../actions'
import {getEntryListByname, getSequenceFilterByName} from '../selectors'
import SequenceFilterIds from './sequenceFilterIds'
import SequenceFilterBoolean from './sequenceFilterBoolean'
import {toJS} from '../utils/immutableToJS'


const SequenceFilter = (props) => {
  const filter = props.filter
  return (
    <div className="FilterContainer">
      <div className="FilterTitle">{props.name}</div>
        <SequenceFilterIds {...props} />
        { filter.ids && filter.ids.length > 0 &&
          <div className="btn-group">
            <SequenceFilterBoolean
              filter={filter}
              field="exclude"
              onChange={props.onChangeExclude} />
              { Object.keys(filter).includes('and') && filter.ids.length > 1 &&
                <SequenceFilterBoolean
                  filter={filter}
                  field="and"
                  onChange={props.onChangeAnd} />
              }
          </div>
        }
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return ({
    items: getEntryListByname(state, ownProps.name),
    filter: getSequenceFilterByName(state, ownProps.name)
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChangeIds: (ids)=>{
    dispatch(setFilterIds(ownProps.name, ids))
  },
  onChangeExclude: (exclude) =>{
    dispatch(setFilterExclude(ownProps.name, exclude))
  },
  onChangeAnd: (and)=>{
    dispatch(setFilterAnd(ownProps.name, and))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(SequenceFilter))
