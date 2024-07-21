// WebcamModal.js
import React, { useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import './style.css';

const WebcamModal = ({ isOpen, onClose, onCapture }) => {
    console.log({isOpen, onclose, onCapture})
    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        onCapture(imageSrc);
        onClose();
    }, [webcamRef, onCapture, onClose]);

    if (!isOpen) return null;

    return (
        <div className="webcamp-modal-overlay" onClick={onClose}>
            <div className="webcamp-modal-content full-screen" onClick={(e) => e.stopPropagation()}>
                <span className="webcamp-modal-close" onClick={onClose}>✕</span>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: { exact: "environment" } }}
                    style={{ width: '100%', height: '100%' }}
                />
                <button onClick={capture} className="webcamp-capture-button">Capture</button>
            </div>
        </div>
    );
};

export default WebcamModal;
