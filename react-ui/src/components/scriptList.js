import React, {Component} from 'react'
import {connect} from 'react-redux'
import {toJS} from '../utils/immutableToJS'
import {fetchScriptsIfNeeded} from '../actions'
import {getScripts} from '../selectors'
import ScriptCard from './scriptCard'
// import {Link} from 'react-router-dom'
import {ListGroup} from 'react-bootstrap'


class ScriptListContainer extends Component{
  componentDidMount(){
    this.props.fetchScripts()
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
    scripts: getScripts(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchScripts: ()=> dispatch(fetchScriptsIfNeeded())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(ScriptListContainer))
