import React, {Component} from 'react'
import { DragDropContext } from 'react-dnd'
import Spinner from 'react-bootstrap/Spinner'
import HTML5Backend from 'react-dnd-html5-backend'
import FullSequencesList from './fullSequencesList'
import ScriptHeader from './scriptHeader'
import ScriptEditSequenceList from './scriptEditSequenceList'
import {connect} from 'react-redux'
import {toJS} from '../utils/immutableToJS'
import {fetchScriptsIfNeeded, fetchSequencesifNeeded, setCurrentScriptId} from '../actions'
import {getCurrentScriptFormatted, getScriptsLoading} from '../selectors'
import {Link} from 'react-router-dom'
import {Nav} from 'react-bootstrap'
import RandomSequencesCreator from './randomSequencesCreator'


import '../app.css'

class ScriptEdit extends Component {
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
        {this.props.loading &&
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        }
        {this.props.script && !this.props.loading &&
          <div>
            <ScriptHeader {...this.props.script} edit={true} />
            <div className="scriptEditorSequencesContainer">
              <section className="sequencePicker">
                <FullSequencesList />
              </section>
              <section className="scriptContainer">
                {this.props.script && this.props.script.sequences &&
                  <ScriptEditSequenceList sequences={this.props.script.sequences} />
                }
                {this.props.script && this.props.script.sequences && this.props.script.sequences.length === 0 &&
                  <RandomSequencesCreator script={this.props.script} />
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
    script: getCurrentScriptFormatted(state),
    loading: getScriptsLoading(state)
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchScripts: ()=>dispatch(fetchScriptsIfNeeded()),
  fetchSequences: ()=>dispatch(fetchSequencesifNeeded()),
  setScript: ()=>dispatch(setCurrentScriptId(props.match.params.id)),
})

export default DragDropContext(HTML5Backend)(connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ScriptEdit)))
