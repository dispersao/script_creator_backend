import React, { Component } from 'react'
import {connect} from 'react-redux'
import { DropTarget } from 'react-dnd'
import {addSequenceToScriptAt} from '../actions'
import {getCurrentScriptId} from '../selectors'

const sequenceTarget = {
  drop({index}, monitor, component) {
    component.props.includeSequence(
      monitor.getItem().seqId,
      component.props.script,
      component.props.index
    )
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

//transform in connected class to have access to dispatch method
class DropSequenceArea extends Component {
  render(){
    let { connectDropTarget, isOver } = this.props
    let clasName = isOver ? 'droparea over' : 'droparea'
    return connectDropTarget(
      <div className={clasName}></div>
    )
  }
}

const mapStateToProps= (state,props) => {
  return {
    script: getCurrentScriptId(state)
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  includeSequence: (seq, script, index)=>{
    dispatch(addSequenceToScriptAt(script, seq, index))
  }
})

const dropArea = DropTarget('sequence', sequenceTarget, collect)(DropSequenceArea);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(dropArea)
