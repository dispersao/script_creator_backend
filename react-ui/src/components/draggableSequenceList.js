import React from 'react'
import DraggableSequence from './draggableSequence'

const DraggableSequencesList = ({sequences}) =>{
  return(
    <div className="Screenplay reduced">
      {sequences && sequences.map((seq, index)=>(
        <DraggableSequence key={index} sequence={seq}></DraggableSequence>
      ))}
    </div>
  )
}

export default DraggableSequencesList
