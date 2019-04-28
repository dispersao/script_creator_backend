import React from 'react'
import Sequence from './sequence'

const SequencesList = ({sequences, reduced}) =>{
  let clas = "Screenplay"
  if(reduced){
    clas += " reduced";
  }
  return(
    <div className={clas}>
      {sequences && sequences.map((seq, index)=>(
        <Sequence key={index} {...seq}></Sequence>
      ))}
    </div>
  )
}

export default SequencesList
