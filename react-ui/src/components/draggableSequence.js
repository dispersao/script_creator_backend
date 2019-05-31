import React from 'react'
import { DragSource } from 'react-dnd'
import Sequence from './sequence'
import {connect} from 'react-redux'
import {addSequenceToEndOfScript} from '../actions'
import {getCurrentScriptId} from '../selectors'


const sequenceSource = {
  beginDrag(props) {
    console.log(props)
    return {
      seqId: props.sequence.id
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function DraggableSequence({ connectDragSource, isDragging, sequence, script, includeSequence }) {
  return connectDragSource(
    <div className="dragContainer sequenceWrapper">
      <button className="deleteSequence" onClick={()=>includeSequence(script, sequence.id)}><i className="fas fa-arrow-right"></i></button>
      <Sequence key={sequence.id} {...sequence}></Sequence>
    </div>
  );
}

const dragSource = DragSource("sequence", sequenceSource, collect)(DraggableSequence);

const mapStateToProps= (state, props) => {
  return {
    script: getCurrentScriptId(state)
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  includeSequence: (script, seq)=>{
    dispatch(addSequenceToEndOfScript(script, seq))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(dragSource)
