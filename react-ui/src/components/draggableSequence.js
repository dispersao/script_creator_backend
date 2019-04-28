import React from 'react'
import { DragSource } from 'react-dnd'
import Sequence from './sequence'

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

function DraggableSequence({ connectDragSource, isDragging, sequence }) {
  return connectDragSource(
    <div className="dragContainer">
      <Sequence key={sequence.id} {...sequence}></Sequence>
    </div>
  );
}

export default DragSource("sequence", sequenceSource, collect)(DraggableSequence);
