import React, { useState } from 'react'
import {connect} from 'react-redux'
import {toJS} from '../utils/immutableToJS'
import {InputGroup, FormControl} from 'react-bootstrap'
import {changeScriptName} from '../actions'


const ScriptName = ({name, id, saveName}) => {
  const [edit, setEdit] = useState(false)

  return (
      <div className="ScriptName">
        { edit &&
          <InputGroup className="mb-3">
            <FormControl
             placeholder="Script's name"
             aria-label="Script's name"
             aria-describedby="basic-addon2"
             defaultValue={name}
             onBlur={(ev)=>{
               saveName(ev.currentTarget.value)
               setEdit(false)
             }}/>
            </InputGroup>
        }
        {!edit &&
          <h3 onClick={()=> setEdit(true)}>{name}</h3>
        }
      </div>
  )
}


const mapDispatchToProps = (dispatch, props) => ({
  saveName:(value)=>dispatch(changeScriptName(props.id, value))
})


export default connect(
  null,
  mapDispatchToProps
)(toJS(ScriptName))
