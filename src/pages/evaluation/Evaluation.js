import React from 'react'
import { Form } from 'react-bootstrap'

function Evaluation() {
  return (
    <div className='evaluation-container'>
      <div className='evaluation-title'>Evaluation</div>
      <div>
        <div>Select Batch</div>
        <Form.Select aria-label="Default select example">
          <option>Select Batch</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
      </div>
      <div>
        <div>Leader Name</div>
        <Form.Select aria-label="Default select example">
          <option>Leader Name</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
      </div>
      <div>
        <div>Select Exam</div>
        <Form.Select aria-label="Default select example">
          <option> Select Exam</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
      </div>
      <div>
        <div>Evaluation Status</div>
        <Form.Select aria-label="Evaluation Status">
          <option>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
      </div>
    </div>
  )
}

export default Evaluation