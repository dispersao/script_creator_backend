import React from 'react'
import {Jumbotron} from 'react-bootstrap'
import ScriptName from './scriptName'
import ScriptAuthor from './scriptAuthor'

const ScriptHeader = ({name, author, id }) => {
  return (
    <Jumbotron className="ScriptHeaderView">
      <ScriptName name={name} id={id}  />
      <div>
        by {author}
      </div>
    </Jumbotron>
  )
}

export default ScriptHeader
