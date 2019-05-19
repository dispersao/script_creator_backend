import React from 'react'
import {Jumbotron} from 'react-bootstrap'
import ScriptName from './scriptName'
import {Link} from 'react-router-dom'
import {Nav} from 'react-bootstrap'

const ScriptHeader = (script) => {
  console.log("ScriptHeader",script);
  return (
    <Jumbotron className="ScriptHeaderView">
      <ScriptName name={script.name} id={script.id}  />
      <div>
        by {script.author}
      </div>
      <Nav className="right-aligned">
        {script.edit &&
          <Link to={`/script/${script.id}`}>View</Link>
        }
        {!script.edit &&
          <Link to={`/script/${script.id}/edit`}>Edit</Link>
        }
      </Nav>
    </Jumbotron>
  )
}

export default ScriptHeader
