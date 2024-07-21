import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";
import WebcamModal from "../../components/UI/WebcamCapture";
import { storage } from "../../firbase/firebase";
import Modal from "../../Modal/ImageModal";
import { useAuth } from "../../store/authContext";

function Candidate() {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [webcamModalOpen, setWebcamModalOpen] = useState(false);
    const a = useAuth();
    console.log({ a })
    const handleImageCaptureClick = () => {
        setIsCameraOn(true);
        handleOpenWebcamModal(true);
    }
    const handleImageClick = (url) => {
        setSelectedImage(url);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedImage('');
    };
    const handleCloseCameraClick = () => {
        setIsCameraOn(false);
    }

    const handleImageRemoval = (index) => {
        setCapturedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const dataURLtoBlob = (dataurl) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };


    const handleUpload = async () => {
        const imageUrls = [];
        for (let i = 0; i < capturedImages.length; i++) {
            const imageSrc = capturedImages[i];
            const imageRef = ref(storage, `images/${Date.now()}.jpg`);
            const uploadTask = uploadBytesResumable(imageRef, dataURLtoBlob(imageSrc));
            console.log({ uploadTask })
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // const progress = Math.round(
                    //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // );
                    // setUploadProgress((prev) => ({ ...prev, [i]: progress }));
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log({ downloadURL })
                    imageUrls.push(downloadURL);
                    // onImageUpload(downloadURL); // Call the parent function to handle the URL
                }
            );
        }
        return imageUrls;
    };

    const handleAssessmentSubmit = async () => {
        const urls = await handleUpload() || [];
        const { currentUser } = a || {};
        if (!currentUser) {
            toast.error('Login expired, please login to upload assessment');
            return;
        }
        console.log({ urls: urls.reverse(), currentUser })
        if (!urls) {
            toast.error('Please upload image');
            return;
        }
    }

    const handleOpenWebcamModal = () => {
        setWebcamModalOpen(true);
    };

    const handleCloseWebcamModal = () => {
        setWebcamModalOpen(false);
    };
    const handleImageUpload = (url) => {
        setCapturedImages((prev) => {
            return [...prev, url]
        });
    };
    return (
        <div className='main-container'>
            <div className='candidate-title'>Exam Name</div>
            <div className='w-100'>
                <Form.Select aria-label="Default select example">
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </div>
            <div>
                <div>Name: Sajjad</div>
                <div>Place: Assam</div>
            </div>
            {/* {isCameraOn && <WebcamCapture setCapturedImages={setCapturedImages} />} */}
            <WebcamModal
                isOpen={webcamModalOpen}
                onClose={handleCloseWebcamModal}
                onCapture={handleImageUpload}
            />
            <div className='capture-image'>
                {!webcamModalOpen && <button onClick={() => handleImageCaptureClick()}>Capture Image</button>}
                {webcamModalOpen && <button onClick={() => handleCloseCameraClick()}> Close Camera </button>}
            </div>
            <div className='image-container'>
                {capturedImages.map((image, index) => (
                    <div key={index} className='image-list'> <img onClick={() => handleImageClick(image)} src={image} alt={`captured ${index}`} style={{ width: '100%', height: '100%' }} />
                        <span onClick={() => handleImageRemoval(index)} className='close-img'><IoIosCloseCircle color='red' size='1.5rem' /></span>
                    </div>
                ))}
            </div>
            <Button className='submit-btn' onClick={(e) => handleAssessmentSubmit(e)} variant="outline-primary">Submit</Button>
            <Modal isOpen={modalOpen} onClose={handleCloseModal} imageUrl={selectedImage} />
        </div>
    )
}

export default Candidate