import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loader() {
    return (
        <div className='d-flex gap-2 justify-content-between align-items-center'>
            <Spinner
                style={{ color: 'green' }}
                as="span"
                animation="grow"
                size="sm"
                role="status"
                color='green'
                aria-hidden="true"
            />
            Loading...
        </div>
    )
}

export default Loader