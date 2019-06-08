import React, {Component} from 'react'
import ScriptHeader from './scriptHeader'
import SequencesList from './sequencesList'
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
  }
  render(){
    return (
      <div className="scriptView">
        <Nav>
          <Link to="/script">Home</Link>
        </Nav>
        {this.props.script &&
          <div>
            <ScriptHeader {...this.props.script} edit={false} />
            <div className="scriptEditorSequencesContainer">
              <section className="scriptContainer">
                {this.props.script && this.props.script.sequences.length &&
                  <SequencesList sequences={this.props.script.sequences} reduced={false} />
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchScripts: ()=>dispatch(fetchScriptsIfNeeded()),
  fetchSequences: ()=>dispatch(fetchSequencesifNeeded()),
  setScript: ()=>dispatch(setCurrentScriptId(ownProps.match.params.id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ScriptView))
