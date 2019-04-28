import React from 'react'
import SequenceCharacter from './sequenceCharacter'

const CharactersList = ({characters})=>(
  <div className="charactersList light">
    {characters.map((character,index)=>(
      <SequenceCharacter key={index} {...character}></SequenceCharacter>
    ))}
  </div>
)

export default CharactersList
