import React from 'react'
import {Jumbotron} from 'react-bootstrap'
import ScriptName from './scriptName'
import SaveCancelScript from './saveCancelScript'

const ScriptHeader = (script) => {
  return (
    <Jumbotron className="ScriptHeaderView">
      <ScriptName name={script.name} id={script.id}  />
      <div>
        by {script.author}
      </div>
      <SaveCancelScript script={script} />
    </Jumbotron>
  )
}

export default ScriptHeader
