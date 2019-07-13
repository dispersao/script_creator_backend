import React from 'react'
import {connect} from 'react-redux'
import {setFilterIds, setFilterExclude} from '../actions'
import {getCategoryListByType, getSequenceFilterByName} from '../selectors'
import SequenceFilterIds from './sequenceFilterIds'
import SequenceFilterBoolean from './sequenceFilterBoolean'
import {toJS} from '../utils/immutableToJS'


const SequenceCategoryFilter = (props) => {
  const filter = props.filter
  return (
    <div className="FilterContainer">
      <div className="FilterTitle">{props.name}</div>
        <SequenceFilterIds {...props} labelField="text"/>
        { filter.ids && filter.ids.length > 0 &&
          <div className="btn-group">
            <SequenceFilterBoolean
              filter={filter}
              field="exclude"
              onChange={props.onChangeExclude} />
          </div>
        }
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return ({
    items: getCategoryListByType(state, ownProps),
    filter: getSequenceFilterByName(state, ownProps.name)
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChangeIds: (ids)=>{
    dispatch(setFilterIds(ownProps.name, ids))
  },
  onChangeExclude: (exclude) =>{
    dispatch(setFilterExclude(ownProps.name, exclude))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(SequenceCategoryFilter))
