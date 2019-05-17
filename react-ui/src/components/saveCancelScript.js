import React, {useState} from 'react'
import {ButtonToolbar, Button} from 'react-bootstrap'
import {toJS} from '../utils/immutableToJS'
import {connect} from 'react-redux'
import {updateScriptIfNeeded, refetchScriptIfNeeded, createScript} from '../actions'


const SaveCancelScript = ({script, ...rest}) => {
  const [redirectTo, setRedirectTo] = useState()

  const cancelClick = () => {
    setRedirectTo('home')
    if(script.new){
      rest.discardNewScript(script)
    } else {
      rest.refetchScript(script)
    }
  }

  const saveClick = () => {
    setRedirectTo('view')
    if(script.new){
      rest.createScript(script)
    } else {
      console.log('updateScript')
      rest.updateScript(script)
    }
  }

  console.log("isEditing? " + rest.isEditing)
  return (
    <ButtonToolbar className="right-aligned">
      <Button variant="link" onClick={cancelClick}>Cancel</Button>
      {!script.synched &&
        <Button variant="outline-secondary" onClick={saveClick}>Save</Button>
      }
    </ButtonToolbar>
  )
}

const mapStateToProps = (state, props) => ({
  isEditing: state.scriptData.get('currentScriptEditing')
})

const mapDispatchToProps = (dispatch, props) => ({
  updateScript: (script)=> dispatch(updateScriptIfNeeded(script)),
  refetchScript: (script)=> dispatch(refetchScriptIfNeeded(script)),
  createScript: (script)=> dispatch(createScript(script)),
  discardNewScript: (script)=> console.log('we will discard the created script')
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(SaveCancelScript))
