import React from 'react'
import { Nav } from 'react-bootstrap'
import { IoIosCloseCircle } from 'react-icons/io'

function EvaluationSearch() {
  return (
    <div>
      <div className='evaluation-search-title'>
          <div className='evaluation-search-name'>Candidate Name</div>
          <div className='evaluation-search-roll'>Roll Number</div>
      </div>
      <div className='evaluation-search-tab'>
      <Nav fill variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link eventKey="link-2">Active</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link>
      </Nav.Item>
    </Nav>
      </div>
      <div className='image-container'>
                {[].map((image, index) => (
                    <div key={index} className='image-list'> <img src={image} alt={`captured ${index}`} style={{ width: '100%', height: '100%' }} />
                        <span className='close-img'><IoIosCloseCircle color='red' size='1.5rem' /></span>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default EvaluationSearch