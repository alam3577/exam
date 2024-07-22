import React, { useEffect, useState } from 'react';
import { Button, Form, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Modal from '../../Modal/ImageModal';
import { findFilteredCandidateData, updateEvaluationDetails } from '../../services/fireStore';

function EvaluationSearch() {
  const [candidateData, setCandidateData] = useState({})
  const [submissionsImage, setSubmissionImage] = useState([])
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [newEvaluationData, setNewEvaluationData] = useState({
    score: '',
    comment: ''
  })
  const [activeTab, setActiveTab] = useState(1)
  const { id, batchId, rollNo } = useParams();
  console.log({ id, batchId, rollNo })


  const handleImageClick = (url) => {
    setSelectedImage(url);
    setModalOpen(true);
  };
  const getData = async (id, batchId, rollNo) => {
    const res = await findFilteredCandidateData(id, batchId, rollNo)
    setCandidateData(res[0]);
    setSubmissionImage([...res[0]?.submissions?.raw])
  }

  console.log({ candidateData })
  useEffect(() => {
    getData(id, batchId, rollNo)
  }, [id, batchId, rollNo])

  const handleProcessedClick = () => {
    setActiveTab(2);
    setSubmissionImage([...candidateData?.submissions?.processed])
  }

  const handleRowClick = () => {
    setActiveTab(1);
    setSubmissionImage([...candidateData?.submissions?.raw])
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage('');
  };

  const handleUpdate = async () => {
    const newEvaluationDetails = {
      score: newEvaluationData?.score,
      comments: newEvaluationData?.comment,
      evaluation_status: 'completed'
    };
    try {
      await updateEvaluationDetails(candidateData?.id, newEvaluationDetails)
      
    } catch (error) {
      
    }
  }
  return (
    <div style={{width: "80%", margin: 'auto'}}>
      <div className='evaluation-search-title'>
        <div className='evaluation-search-name'>Name: {candidateData?.candidate_name || 'Candidate Name'}</div>
        <div className='evaluation-search-roll'>Roll Number: {candidateData?.roll_number}</div>
      </div>
      {candidateData?.evaluation_details?.evaluation_status === "completed" ? <div className='text-success fs-6 fw-bold'>**Evaluation Completed</div> : null}
      <div className='evaluation-search-tab'>
        <Nav fill variant="tabs" defaultActiveKey="/home">
          <Nav.Item onClick={handleRowClick}>
            <Nav.Link active={activeTab === 1} eventKey="link-2">Raw</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={handleProcessedClick}>
            <Nav.Link active={activeTab === 2} eventKey="link-1">Processed</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <div className='image-container'>
        {submissionsImage?.length ? (submissionsImage || []).map((image, index) => (
          <div key={index} className='image-list-ev'> <img onClick={() => handleImageClick(image)} src={image} alt={`captured ${index}`} style={{ width: '100%', height: '100%' }} />
            {/* <span className='close-img'><IoIosCloseCircle color='red' size='1.5rem' /></span> */}
          </div>
        )) : <p>No Image found</p>}
      </div>

      <Form className='w-100 mt-3'>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label style={{ fontWeight: '600' }}>Score</Form.Label>
          <Form.Control value={candidateData?.evaluation_details?.score} onChange={(e) => {
            setNewEvaluationData(prev => {
              return {...newEvaluationData, score: e.target.value}
            })
          }} type="email" placeholder="Enter Score" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label style={{ fontWeight: '600' }}>Comments</Form.Label>
          <Form.Control as="textarea" value={candidateData?.evaluation_details?.comments} onChange={(e) => {
            setNewEvaluationData(prev => {
              return {...newEvaluationData, comment: e.target.value}
            })
          }} rows={3} />
        </Form.Group>
      </Form>
      <Button onClick={handleUpdate} className='w-100' variant='outline-success mb-4'>Submit</Button>
      <Modal isOpen={modalOpen} onClose={handleCloseModal} imageUrl={selectedImage} />

    </div>
  )
}

export default EvaluationSearch