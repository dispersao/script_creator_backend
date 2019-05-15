import React, {Component} from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import FullSequencesList from './fullSequencesList'
import ScriptHeader from './scriptHeader'
import ScriptEditSequenceList from './scriptEditSequenceList'
import {connect} from 'react-redux'
import {toJS} from '../utils/immutableToJS'
import {fetchScriptsIfNeeded, fetchSequencesifNeeded, setCurrentScriptId} from '../actions'
import {getCurrentScriptFormatted} from '../selectors'
import {Link} from 'react-router-dom'
import {Nav} from 'react-bootstrap'

import '../app.css'

class ScriptView extends Component {
  componentDidMount(){
    this.props.fetchScripts()
    this.props.fetchSequences()
    this.props.setScript()
    this.props.copyConsistentScript()
  }
  render(){
    return (
      <div className="scriptView">
        <Nav>
          <Link to="/scripts">Home</Link>
        </Nav>
        {this.props.script &&
          <div>
            <ScriptHeader {...this.props.script} />
            <div className="scriptEditorSequencesContainer">
              <section className="sequencePicker">
                <FullSequencesList />
              </section>
              <section className="scriptContainer">
                {this.props.script && this.props.script.sequences.length &&
                  <ScriptEditSequenceList sequences={this.props.script.sequences} />
                }
              </section>
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps= (state,props) => {
  return {
    script: getCurrentScriptFormatted(state)
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchScripts: ()=>dispatch(fetchScriptsIfNeeded()),
  fetchSequences: ()=>dispatch(fetchSequencesifNeeded()),
  setScript: ()=>dispatch(setCurrentScriptId(props.match.params.id)),
  copyConsistentScript: ()=>console.log('dispatch action to store consistent script')
})

export default DragDropContext(HTML5Backend)(connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ScriptView)))
