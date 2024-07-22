import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { Navigate, useParams } from "react-router-dom";
import Loader from "../../components/UI/Loader";
import { storage } from "../../firbase/firebase";
import Modal from "../../Modal/ImageModal";
import { getBatchDetailsById } from "../../services/batch";
import { getExamDetailsById } from "../../services/exam";
import { createData } from "../../services/fireStore";
import { useAuth } from "../../store/authContext";

function Candidate() {
    const [capturedImages, setCapturedImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [imageURL, setImageURL] = useState([]);
    const [loading, setLoading] = useState(false);
    const [examDetails, setExamDetails] = useState({});
    const [selectedCandidate, setSelectedCandidate] = useState({});
    const [candidateData, setCandidateData] = useState([]);
    const fileInputRef = useRef(null);
    const { id, batchId } = useParams();
    const a = useAuth();
    const userName = a?.currentUser?.displayName || '';
    const userEmail = a?.currentUser?.email || '';
    console.log({ a })
    const handleImageClick = (url) => {
        setSelectedImage(url);
        setModalOpen(true);
    };

    const getData = async (id) => {
        const res = await getExamDetailsById(id)
        console.log({res})
        setExamDetails(res);
        const batchData = await getBatchDetailsById(res?.batch_id);
        setCandidateData(batchData?.candidates_list || []);
        console.log({ res })
    }

    console.log({ examDetails });
    useEffect(() => {
        getData(id)
    }, [id]);

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedImage('');
    };

    const handleImageRemoval = (index) => {
        setCapturedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        try {
            console.log({ capturedImages });
            const imageUrls = [];

            for (let i = 0; i < capturedImages.length; i++) {
                const imageSrc = capturedImages[i];
                const blob = await fetch(imageSrc).then(res => res.blob());
                const imageName = Date.now() + "_image.jpg";
                const imageRef = ref(storage, `images/${imageName}`);

                await uploadBytesResumable(imageRef, blob);
                const downloadURL = await getDownloadURL(imageRef);
                imageUrls.push(downloadURL);
            }

            console.log('Uploaded Image URLs:', imageUrls);
            return imageUrls;
        } catch (error) {
            console.error("Error uploading images:", error);
            throw error;
        }
    };

    const { userLoggedIn } = useAuth()

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            console.log(url); // This URL can be used to display the captured image
            // Handle the captured image here
            setCapturedImages((prev) => {
                return [...prev, url]
            });
        }
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
            console.log({urls})
            if (!urls?.length) {
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
                    evaluation_status: "pending",
                },
                submissions: {
                    raw: [...urls],
                    processed: []
                },
                submission_locked: "true",
                exam_id: id,
                batch_id: batchId
            });
            setCapturedImages([]);
            setImageURL([]);
            toast.success('Congratulation, you have successfully submitted the assessment')
        } catch (error) {
            console.log({ error })
            toast.error('Failed to submit the assessment, please try again')
        } finally {
            setLoading(false);
        }
    }

    const openCamera = () => {
        fileInputRef.current.click();
    };



    const handleRollNoChange = (e) => {
        const roll = e.target.value;
        setRollNumber(roll);
        const selectedCandidate = [...candidateData]?.find(elem => elem.roll_number === roll);
        setSelectedCandidate(selectedCandidate);
    }

    console.log({candidateData})
    return (
        <div className='main-container'>
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}
            <div className='candidate-title text-capitalize'>{(examDetails?.name && (examDetails?.name + ' Exam')) || 'Exam Name'}</div>
            <div className='w-100'>
                <Form.Select aria-label="Default select example" onChange={(e) => handleRollNoChange(e)}>
                    <option value=''>Select Roll No.</option>
                    {
                        (candidateData || [])?.map(elem => (
                            <option key={elem?.roll_number} value={elem?.roll_number}>{elem?.roll_number}</option>
                        ))
                    }
                </Form.Select>
            </div>
            <div>
                { Object.entries(selectedCandidate)?.length ?
                    <>
                        <div>Name: {selectedCandidate?.candidate_name || userName}</div>
                        <div>Place: {selectedCandidate?.place}</div>
                    </> : null
                }
                <div>Email: {userEmail}</div>
            </div>
            <div className='image-container'>
                {capturedImages.map((image, index) => (
                    <div key={index} className='image-list'> <img onClick={() => handleImageClick(image)} src={image} alt={`captured ${index}`} style={{ width: '100%', height: '100%' }} />
                        <span onClick={() => handleImageRemoval(index)} className='close-img'><IoIosCloseCircle style={{ borderRadius: '50%', backgroundColor: 'white' }} color='red' size='1.5rem' /></span>
                    </div>
                ))}
            </div>
            <div className='capture-image d-flex flex-column gap-4 w-100'>
                <div>
                    <button className="camera-btn" style={{ margin: 'auto' }} onClick={openCamera}><div><FaCamera size='1.8rem' color="gray" /><div>Camera</div></div> </button>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>
                <Button className='submit-btn w-100 btn-block' disabled={loading} onClick={(e) => handleAssessmentSubmit(e)} variant="outline-success">
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