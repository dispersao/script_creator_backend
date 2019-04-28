import React from 'react'
import SequenceCharactersList from './sequenceCharactersList'
import PartsList from './partsList'

const Sequence = ({type, location, id, characters, parts}) => {
  let clas= "SequenceContainer";

  return (
    <div className={clas}>
      <div className="SequenceTitle">{type.name} - {location.name} <span className="light">#{id}</span></div>
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
