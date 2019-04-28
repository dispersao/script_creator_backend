import React from 'react'
import ScriptEditSequence from './scriptEditSequence'
import DropSequenceArea from './dropSequenceArea'
// import ScriptEditSequence from './draggableSequence'

const ScriptEditSequenceList = ({sequences}) =>{
  return(
    <div className="Screenplay reduced">
      {sequences && sequences.map((seq, index)=>(
        <div key={index}>
          <DropSequenceArea index={index}></DropSequenceArea>
          <ScriptEditSequence  sequence={seq} index={index}></ScriptEditSequence>
        </div>
      ))}
      <DropSequenceArea index={sequences.length}></DropSequenceArea>
    </div>
  )
}

export default ScriptEditSequenceList
