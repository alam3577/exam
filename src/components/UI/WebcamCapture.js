// WebcamModal.js
import { useWindowSize } from "@uidotdev/usehooks";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './style.css';
const WebcamModal = ({ isOpen, onClose, onCapture }) => {
    console.log({ isOpen, onclose, onCapture })
    const webcamRef = useRef(null);
    const size = useWindowSize();

    const isLandscape = size.height <= size.width;
    const ratio = isLandscape ? size.width / size.height : size.height / size.width;
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        onCapture(imageSrc);
        onClose();
    }, [webcamRef, onCapture, onClose]);

    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    if (!isOpen) return null;

    return (
        <div className="webcamp-modal-overlay" onClick={onClose}>
            <div className="webcamp-modal-content full-screen" onClick={(e) => e.stopPropagation()}>
                <span className="webcamp-modal-close" onClick={onClose}>✕</span>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: { exact: "environment" }, aspectRatio: ratio }}
                    style={{ width: '100%', height: '100%' }}
                />
                <button onClick={capture} className="webcamp-capture-button">Capture</button>
            </div>
        </div>
    );
};

export default WebcamModal;
