import React from 'react'
import {Jumbotron} from 'react-bootstrap'
import ScriptName from './scriptName'
import ScriptAuthor from './scriptAuthor'

const ScriptHeader = ({name, author, id }) => {
  return (
    <Jumbotron className="ScriptHeaderView">
      <ScriptName name={name} id={id}  />
      <ScriptAuthor author={author} id={id} />
    </Jumbotron>
  )
}

export default ScriptHeader
