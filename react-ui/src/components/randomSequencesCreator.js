import React, {useState, useRef} from 'react'
import {ButtonToolbar, Modal, Button, Form} from 'react-bootstrap'
import {createRandomScript} from '../actions'
import {connect} from 'react-redux'

const RandomSequencesCreator = ({script, createRandomSequences}) => {
  const [viewState, setViewState] = useState('modalHide')
  const amountEl = useRef(null)

  const onRandomClick = () =>{
    setViewState('modal')
  }

  const onCancelClick = () =>{
    setViewState('modalHide')
  }

  const onCreate = (event) => {
    event.preventDefault();
    event.stopPropagation();

    createRandomSequences(script.id, amountEl.current.value)
  }

    return (
      <>
      <ButtonToolbar className="">
        <Button variant="outline-secondary" onClick={onRandomClick}>random sequences</Button>
      </ButtonToolbar>

        <Modal show={viewState === 'modal'} onHide={onCancelClick}>
          <Modal.Header closeButton>
            <Modal.Title>Add random sequences</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Total Minutes</Form.Label>
              <Form.Control autoComplete="scriptHour" type="number" min="0" max="90" placeholder="How long should the film last?" ref={amountEl}/>
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
  createRandomSequences: (script, total)=> dispatch(createRandomScript(script, total))
})

export default connect(
  null,
  mapDispatchToProps
)(RandomSequencesCreator)
