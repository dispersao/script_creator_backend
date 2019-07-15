import React, {useState} from 'react'
import { ButtonToolbar, Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { removeScript, copyScript } from '../actions'
import {Link} from 'react-router-dom'


const ScriptCard = ({name, sequences, id, author, last_editor, deleteScript, duplicateScript, duration}) => {
  const [viewState, setViewState] = useState()

  const onCancelClick = () =>{
    setViewState('modalHide')
  }

  const onDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if(viewState === 'modal'){
      deleteScript(id)
      setViewState('modalHide')
    }
  }

  return (
    <>
    <Modal show={viewState === 'modal'} onHide={onCancelClick}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Script!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Are you sure you want to delete script {name}?</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancelClick}>
          No
        </Button>
        <Button variant="primary" onClick={onDelete}>
          Yes! Go for it!
        </Button>
      </Modal.Footer>
    </Modal>
    <div className="ScriptCardContainer">

      <h3 className="ScriptCardTile">{name}</h3>
      <div className="ScriptCardInfo">
        <div className="ScriptCardAuthorContainer">
          <span>author </span>
          <span className="label label-default">{author}</span>
        </div>
        <div className="ScriptCardAuthorContainer">
          <span>edited by </span>
          <span className="label label-default">{last_editor}</span>
        </div>
        <div className="ScriptCardSequenceCount">
          <span>{sequences.length} {sequences.length === 1 ? 'sequence' : 'sequences'}</span>
        </div>
        <div className="ScriptCardSequenceCount">
          <span>{duration}</span>
        </div>
        <ButtonToolbar >
          <Link to={`/script/${id}`}>
            <Button variant="outline-secondary"><i className="far fa-eye"></i></Button>
          </Link>
          <Link to={`/script/${id}/edit`}>
            <Button variant="outline-secondary"><i className="far fa-edit"></i></Button>
          </Link>
          <Button variant="outline-secondary" onClick={()=>duplicateScript(id)}><i className="far fa-copy"></i></Button>
          <Button variant="outline-secondary" onClick={()=>setViewState('modal')}><i className="far fa-trash-alt"></i></Button>
        </ButtonToolbar>
      </div>
    </div>
    </>
  )
}

const mapDispatchToProps = (dispatch, props) => ({
  deleteScript: (id)=> dispatch(removeScript(id)),
  duplicateScript: (id) => dispatch(copyScript(id))
})

export default connect(
  null,
  mapDispatchToProps
)(ScriptCard)
