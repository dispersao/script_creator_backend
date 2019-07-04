import React from 'react'
import SequenceCharactersList from './sequenceCharactersList'
import PartsList from './partsList'

const Sequence = ({type, location, id, sceneNumber, characters, parts, duration}) => {
  let clas= "SequenceContainer";

  return (
    <div className={clas}>
      <div className="SequenceTitle">{type.name} - {location.name} <span className="light">#{sceneNumber}</span><span className="duration light">{duration}</span></div>
      {characters && characters.length > 0 &&
        <div className="charactersList light">
          <SequenceCharactersList characters={characters} />
        </div>
      }
      <div className="partsContanier">
        <PartsList parts={parts} />
      </div>
    </div>
  )
}

export default Sequence
