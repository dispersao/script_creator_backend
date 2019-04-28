import React, { useState } from 'react'
import {connect} from 'react-redux'
import {toJS} from '../utils/immutableToJS'
import {InputGroup, FormControl} from 'react-bootstrap'
import {changeScriptAuthor} from '../actions'


const ScriptAuthor = ({author, id, saveAuthor}) => {
  const [edit, setEdit] = useState(false)

  return (
      <div className="ScriptName">
        { edit &&
          <InputGroup className="mb-3">
            <FormControl
             placeholder="Script's author"
             aria-label="Script's author"
             aria-describedby="basic-addon2"
             defaultValue={author}
             onBlur={(ev)=>{
               saveAuthor(ev.currentTarget.value)
               setEdit(false)
             }}
            />
            </InputGroup>
        }
        {!edit &&
          <div onClick={()=> setEdit(true)}>{author}</div>
        }
      </div>
  )
}

const mapDispatchToProps = (dispatch, props) => ({
  saveAuthor:(value)=>dispatch(changeScriptAuthor(props.id, value))
})



export default connect(
  null,
  mapDispatchToProps
)(toJS(ScriptAuthor))
