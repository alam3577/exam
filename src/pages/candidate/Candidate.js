import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";
import { Navigate } from "react-router-dom";
import Loader from "../../components/UI/Loader";
import WebcamModal from "../../components/UI/WebcamCapture";
import { storage } from "../../firbase/firebase";
import Modal from "../../Modal/ImageModal";
import { createData, readData } from "../../services/fireStore";
import { useAuth } from "../../store/authContext";

function Candidate() {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [imageURL, setImageURL] = useState([]);
    const [webcamModalOpen, setWebcamModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const a = useAuth();
    const userName = a?.currentUser?.displayName || '';
    const userEmail = a?.currentUser?.email || '';
    console.log({ a })
    const handleImageCaptureClick = () => {
        setIsCameraOn(true);
        handleOpenWebcamModal(true);
    }
    const handleImageClick = (url) => {
        setSelectedImage(url);
        setModalOpen(true);
    };

    const getData = async () => {
        const res = await readData()
        console.log({ res })
    }

    useEffect(() => {
        getData()
    }, []);

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
        console.log({ capturedImages })
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
                    setImageURL(prev => {
                        return [...prev, downloadURL]
                    });
                }
            );
        }
    };

    const handleOpenWebcamModal = () => {
        setWebcamModalOpen(true);
    };

    const { userLoggedIn } = useAuth()


    const handleCloseWebcamModal = () => {
        setWebcamModalOpen(false);
    };
    const handleImageUpload = (url) => {
        setCapturedImages((prev) => {
            return [...prev, url]
        });
    };
    const handleAssessmentSubmit = async () => {
        if (!rollNumber) {
            toast.error('Please select roll no. to submit the assessment');
            return;
        }
        if (!userEmail) {
            toast.error('Login expired, please login to upload assessment');
            return;
        }
        const notNullCapturedImage = capturedImages.filter(element => element !== null)
        if (!notNullCapturedImage?.length) {
            toast.error('please Capture the proper image')
            return;
        }
        setLoading(true);
        try {
            const urls = await handleUpload() || [];
            console.log({ imageURL })
            if (!imageURL?.length) {
                toast.error('Please upload image');
                setLoading(false)
                return;
            }
            await createData({
                candidate_name: userName,
                candidate_email: userEmail,
                roll_number: rollNumber,
                evaluation_details: {
                    score: "",
                    comments: "",
                    evaluation_status: "",
                },
                submissions: {
                    raw: [...imageURL],
                    processed: []
                },
                submission_locked: "true"
            });
            setCapturedImages([]);
            setImageURL([]);
            toast.success('Congratulation, you have successfully submitted the assessment')
        } catch (error) {
            toast.error('Failed to submit the assessment, please try again')
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='main-container'>
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}
            <div className='candidate-title'>Exam Name</div>
            <div className='w-100'>
                <Form.Select aria-label="Default select example" onChange={(e) => setRollNumber(e.target.value)}>
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </div>
            <div>
                <div>Name: {userName}</div>
                <div>Email: {userEmail}</div>
            </div>
            {/* {isCameraOn && <WebcamCapture setCapturedImages={setCapturedImages} />} */}
            <WebcamModal
                isOpen={webcamModalOpen}
                onClose={handleCloseWebcamModal}
                onCapture={handleImageUpload}
            />
            <div className='image-container'>
                {capturedImages.map((image, index) => (
                    <div key={index} className='image-list'> <img onClick={() => handleImageClick(image)} src={image} alt={`captured ${index}`} style={{ width: '100%', height: '100%' }} />
                        <span onClick={() => handleImageRemoval(index)} className='close-img'><IoIosCloseCircle color='red' size='1.5rem' /></span>
                    </div>
                ))}
            </div>
            <div className='capture-image d-flex gap-4'>
                {!webcamModalOpen && <button className="btn btn-outline-success" onClick={() => handleImageCaptureClick()}>Capture Image</button>}
                {webcamModalOpen && <button className="btn btn-outline-danger" onClick={() => handleCloseCameraClick()}> Close Camera </button>}
                <Button className='submit-btn' disabled={loading} onClick={(e) => handleAssessmentSubmit(e)} variant="outline-success">
                    {
                        loading ? <Loader /> : 'Submit'
                    }
                </Button>
            </div>
            <Modal isOpen={modalOpen} onClose={handleCloseModal} imageUrl={selectedImage} />
        </div>
    )
}

export default Candidate