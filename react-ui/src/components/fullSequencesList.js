import React, {Component} from 'react'
import DraggableSequencesList from './draggableSequenceList'
import SequenceFilters from './sequenceFilters'
import {connect} from 'react-redux'
import {fetchSequencesifNeeded} from '../actions'
import {getFilteredSequences} from '../selectors'
import {toJS} from '../utils/immutableToJS'


class FullSequencesList extends Component{
  componentDidMount(){
    this.props.fetchSequences()
  }
  render(){
    return (
      <div className="ScreenplayContainer">
        <SequenceFilters />
        <DraggableSequencesList sequences={this.props.sequences}></DraggableSequencesList>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  sequences: getFilteredSequences(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchSequences: ()=> dispatch(fetchSequencesifNeeded())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(FullSequencesList))
