import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loader({color}) {
    return (
        <div className='d-flex'>
            <Spinner
                style={{ color: color ? color : 'green' }}
                as="span"
                animation="grow"
                size="sm"
                role="status"
                color='green'
                aria-hidden="true"
            />
            <span style={{ color: color ? color : 'black' }}>Loading...</span>
        </div>
    )
}

export default Loader