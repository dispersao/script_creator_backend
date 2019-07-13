import React, {Component} from 'react'
import {connect} from 'react-redux'
import {toJS} from '../utils/immutableToJS'
import {fetchScriptsIfNeeded, fetchSequencesifNeeded} from '../actions'
import {getScriptsWithDuration} from '../selectors'
import ScriptCard from './scriptCard'
// import {Link} from 'react-router-dom'
import {ListGroup} from 'react-bootstrap'


class ScriptListContainer extends Component{
  componentDidMount(){
    this.props.fetchScripts()
    this.props.fetchSequences()
  }

  render(){
    return (
      <ListGroup>
        { this.props.scripts && Object.keys(this.props.scripts).map((index) => (
          <ListGroup.Item key={index}>

            <ScriptCard key={index} {...this.props.scripts[index]} onClick={this.props.onClick} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return{
    scripts: getScriptsWithDuration(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchScripts: ()=> dispatch(fetchScriptsIfNeeded()),
  fetchSequences: ()=> dispatch(fetchSequencesifNeeded())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ScriptListContainer))
