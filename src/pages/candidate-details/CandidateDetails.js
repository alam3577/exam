import React, { useEffect, useState } from 'react';
import { Button, Pagination, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/UI/Loader';
import ConfirmationModal from '../../Modal/ConfirmationModal';
import CreateEditModal from '../../Modal/CreateEditExamModal';
import MessageModal from '../../Modal/MessageModal';
import { getBatchDetailsById } from '../../services/batch';
import { deleteExamData, getExamDetailsById } from '../../services/exam';

function CandidateDetails() {
    const [showModal, setShowModal] = useState(false);
    const [candidaDetails, setCandidateDetails] = useState({});
    const [showActiveConfirmationModal, setShowActiveConfirmationModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [candidateData, setCandidateData] = useState([]);
    const [selectedAction, setSelectedAction] = useState({
        title: '',
        isEdit: false,
        data: {}
    });
    const {id, batchId} = useParams();
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const navigate = useNavigate();
    const handleSubmit = (inputValue) => {
        console.log('Input Value:', inputValue);
    };

    let active = 2;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }

    const getData = async (id) => {
        setLoading(true);
        const res = await getExamDetailsById(id)
        const batchData = await getBatchDetailsById(res?.batch_id);
        setCandidateData(batchData?.candidates_list || []);
        console.log({ res, batchData });
        setCandidateDetails(res);
        setLoading(false);
    }
    console.log({batchId})
    useEffect(() => {
        getData(id)
    }, [id]);


    const handleEditExam = () => {
        // setSelectedAction
    }

    const handleAddCandidate = () => {
        // setSelectedAction
        handleShow();
        setSelectedAction({
            title: 'Add Candidate Name',
            isEdit: false,
            data: {},
            placeholder: 'Enter Candidate Name',
            type: 'candidateDetails',
            action: 'add'
        })

    }

    const newData = (data) => {
        console.log({ data })
        if (data?.type === 'add') {
            setExamData((prevState) => {
                return [data?.data, ...prevState]
            });
        } else {

        }
    }

    const handleDeleteExam = async (res) => {
        console.log({ res })
        try {
            if (res) {
                setContentLoading(true);
                await deleteExamData(currentId);
                const filteredData = examData?.filter(elem => elem?.id !== currentId);
                setExamData(filteredData);
                toast.success('Exam deleted')
            } else {
                toast.error('Failed to delete the exam')
            }
        } catch (error) {
            toast.error('Failed to delete the exam')
        } finally {
            setContentLoading(false);
        }
    }

    const showConfirmationModal = (id) => {
        setCurrentId(id);
        setShowActiveConfirmationModal(true);
    }

    const showMessModal = (id) => {
        console.log({id, h: `${window.location.origin}/exam/${id}` })
        // setCurrentId(id);
        // setShowActiveConfirmationModal(true);
        setMessageContent(`${window.location.origin}/candidate-exam/${id}`);
        setShowMessageModal(true);
    }

    const closeMessModal = () => {
        setShowMessageModal(false);
    }

    const handleCloseConfirmationModal = () => {
        setShowActiveConfirmationModal(false);
    }
    
    return (
        <div className='container'>
            <div className='d-flex justify-content-between align-items-center py-3'>
                <div className='text-capitalize'>{(candidaDetails?.name && `${candidaDetails?.name} Exam (${candidaDetails?.batch_name} Batch)` )  || 'Exam Name'}</div>
                {/* <Button onClick={() => handleAddCandidate()} className='btn btn-sm' variant="outline-success">Add Candidate</Button> */}
            </div>
            {/* <Form.Control type="text" placeholder="Search Exam" /> */}
            <Table striped bordered hover responsive size="sm">
                <thead>
                    <tr>
                        <th>C.Name</th>
                        <th>C.Roll</th>
                        <th>C.Place</th>
                        <th>C.Leader</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? <Loader /> :
                            (candidateData || [])?.map(elem => (
                                <tr key={elem?.id} onClick={() => setCurrentId(elem?.roll_number)}>
                                    <td>{elem?.name}</td>
                                    <td>{elem?.roll_number}</td>
                                    <td>{elem?.place}</td>
                                    <td>{elem?.leader}</td>
                                    <td className='d-flex gap-3'>
                                        <Button style={{ width: '8rem'}} onClick={() => navigate(`/evaluation-search/${id}/${batchId}/${elem?.roll_number}`)} className='btn btn-sm' variant="outline-success">View Submission</Button>
                                        {/* <Button className='btn btn-sm' variant="outline-success">Edit</Button>
                                        <Button onClick={(elem) => showConfirmationModal(elem?.id)} className='btn btn-sm' variant="outline-danger">{elem?.id === currentId && contentLoading ? <Loader /> : 'Delete'}</Button> */}
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </Table>
            {/* <Pagination>{items}</Pagination> */}
            <MessageModal show={showMessageModal} handleClose={closeMessModal} title="Exam Link" content={messageContent}/>
            <ConfirmationModal show={showActiveConfirmationModal} title='Delete Exam' handleClose={handleCloseConfirmationModal} handleSubmit={handleDeleteExam} content='Are you sure you want to delete' />
            <CreateEditModal selectedAction={selectedAction} show={showModal} handleClose={handleClose} newData={newData} />
        </div>
    )
}

export default CandidateDetails