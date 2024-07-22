// src/CreateEditModal.js
import copy from 'copy-to-clipboard';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';

const MessageModal = ({ show, handleClose, title, content, handleSubmit }) => {
    const handleCopyLink = () => {
        copy(content);
        toast.success('Link copied');
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span style={{ wordWrap: 'break-word', color: 'blue' }}>{content}</span>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-sm' variant="danger" onClick={handleClose}>
                    Close
                </Button>
                <Button onClick={handleCopyLink} className='btn-sm' variant="outline-success">
                    Copy Exam Link
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MessageModal;
