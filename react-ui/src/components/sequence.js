import React from 'react'
import SequenceCharactersList from './sequenceCharactersList'
import PartsList from './partsList'
import CategoriesList from './categoriesList'

const Sequence = ({type, location, id, sceneNumber, characters, parts, durationString, categories}) => {
  let clas= "SequenceContainer";

  return (
    <div className={clas}>
      <div className="SequenceTitle">{type.name} - {location.name} <span className="light">#{sceneNumber}</span><span className="duration light">{durationString}</span></div>
      {characters && characters.length > 0 &&
        <div className="charactersList light">
          <SequenceCharactersList characters={characters} />
        </div>
      }
      <div className="partsContanier">
        <PartsList parts={parts} />
      </div>
      {categories && categories.length > 0 &&
        <div className="light">
          <CategoriesList categories={categories} />
        </div>
      }
    </div>
  )
}

export default Sequence
