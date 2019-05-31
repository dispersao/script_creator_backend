import React from 'react'
import Sequence from './sequence'
import {connect} from 'react-redux'
import {getCurrentScriptId} from '../selectors'
import {toJS} from '../utils/immutableToJS'
import {removeSequenceFromScript} from '../actions'


const ScriptEditSequence = ({sequence, deleteSequence, index, script}) => {

  return (
    <div className="sequenceWrapper">
      <button className="deleteSequence" onClick={()=>deleteSequence(script, index)}><i className="far fa-trash-alt"></i></button>
      <Sequence key={index} {...sequence}></Sequence>
    </div>
  )
}

const mapStateToProps = (state, props) => ({
  script: getCurrentScriptId(state)
})

const mapDispatchToProps = (dispatch, props) =>({
  deleteSequence: (script, index) => dispatch(removeSequenceFromScript(script, index))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ScriptEditSequence))
