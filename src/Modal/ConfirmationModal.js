// src/CreateEditModal.js
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ConfirmationModal = ({ show, handleClose, title, content, handleSubmit }) => {

    const onSubmit = async () => {
        handleSubmit(true);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {content}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={onSubmit}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
