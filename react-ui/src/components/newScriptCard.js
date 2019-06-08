import React, {useState, useRef} from 'react'
import {ButtonToolbar, Modal, Button, Form} from 'react-bootstrap'
import {createScript} from '../actions'
import {connect} from 'react-redux'

const NewScriptCard = (props) => {
  const [viewState, setViewState] = useState()
  const nameEl = useRef(null)
  // const amountEl = useRef(null)

  const newClick = () =>{
    setViewState('modal')
  }

  const onCancelClick = () =>{
    setViewState('modalHide')
  }

  const onCreate = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if(viewState === 'modal'){
      props.createNewScript(nameEl.current.value)

    }
  }

    return (
      <>
      <ButtonToolbar className="right-aligned">
        <Button variant="outline-secondary" onClick={newClick}>New</Button>
      </ButtonToolbar>

        <Modal show={viewState === 'modal'} onHide={onCancelClick}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Script</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Script Name</Form.Label>
              <Form.Control autoComplete="scriptName" placeholder="My awsome super cool script" ref={nameEl}/>
              <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCancelClick}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onCreate}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
        </>
    )
}

const mapDispatchToProps = (dispatch, props) => ({
  createNewScript: (name)=> dispatch(createScript(name)),
})

export default connect(
  null,
  mapDispatchToProps
)(NewScriptCard)
