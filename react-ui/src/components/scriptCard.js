import React from 'react'


const ScriptCard = ({name, sequences, id, author, last_editor}) => {
  return (
    <div className="ScriptCardContainer">
      <h3 className="ScriptCardTile">{name}</h3>
      <div className="ScriptCardInfo">
        <div className="ScriptCardAuthorContainer">
          <span>author </span>
          <span className="label label-default">{author}</span>
        </div>
        <div className="ScriptCardAuthorContainer">
          <span>last edited by </span>
          <span className="label label-default">{last_editor}</span>
        </div>
        <div className="ScriptCardSequenceCount">
          <span>{sequences.length} {sequences.length === 1 ? 'sequence' : 'sequences'}</span>
        </div>
      </div>
    </div>
  )
}

export default ScriptCard
