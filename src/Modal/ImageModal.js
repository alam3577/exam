// Modal.js
import React from 'react';
import './style.css';

const Modal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="image-modal-close" onClick={onClose}>✕</span>
                <img src={imageUrl} alt="Full Size" className="modal-image" />
            </div>
        </div>
    );
};

export default Modal;
