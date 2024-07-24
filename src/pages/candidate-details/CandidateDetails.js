import React, { useEffect, useState } from 'react';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/UI/Loader';
import ConfirmationModal from '../../Modal/ConfirmationModal';
import CreateEditModal from '../../Modal/CreateEditExamModal';
import MessageModal from '../../Modal/MessageModal';
import { getBatchDetailsById } from '../../services/batch';
import { deleteExamData, getExamDetailsById } from '../../services/exam';
import { findFilteredCandidateData } from '../../services/fireStore';

const obj = {
    completed: 'Completed',
    pending: 'Submitted',
    not_submitted: 'Not Submitted'
}

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
    const [candidateDataCopy, setCandidateDataCopy] = useState([]);
    const [candidateLead, setCandidateLead] = useState([]);
    const [candidateFilterLead, setCandidateFilterLead] = useState('');
    const [candidateStatus, setCandidateStatus] = useState([]);
    const [candidateFilterStatus, setCandidateFilterStatus] = useState('');

    const [selectedAction, setSelectedAction] = useState({
        title: '',
        isEdit: false,
        data: {}
    });
    const { id, batchId } = useParams();
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
        setCandidateDetails(res);
        const batchData = await getBatchDetailsById(res?.batch_id);
        const leads = [...new Set([...(batchData?.candidates_list?.map(elem => elem?.leader) || [])])];
        setCandidateLead(leads);

        console.log({ leads, batchData })
        const candidateWithStatusPromises = batchData?.candidates_list?.map(async (elem) => {
            const candidateExamSubmission = await findFilteredCandidateData({ examId: id, batchId, rollNumber: elem?.roll_number });
            if (!candidateExamSubmission?.length) {
                return { ...elem, status: 'Not Submitted', type: 'not_submitted' }
            } else if (candidateExamSubmission?.length) {
                if (candidateExamSubmission[0]?.evaluation_details?.evaluation_status === 'completed') {
                    return { ...elem, status: 'Completed', type: 'completed' }
                } else {
                    return { ...elem, status: 'Submitted', type: 'pending' }
                }
            }
            // console.log({alam})
        })
        const candidateWithStatus = await Promise.all(candidateWithStatusPromises);
        setCandidateData(candidateWithStatus || []);
        setCandidateDataCopy(candidateWithStatus || [])
        const status = [...new Set([...(candidateWithStatus?.map(elem => elem?.type) || [])])];
        setCandidateStatus(status);
        console.log({ status })
        // await findFilteredCandidateData({examId: id, batchId, rollNumber: 1})
        console.log({ res, batchData, candidateWithStatus });
        setLoading(false);
    }
    console.log({ batchId })
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
        console.log({ id, h: `${window.location.origin}/exam/${id}` })
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
    console.log({ candidaDetails })

    const handleLeadFilterChange = (e) => {
        setCandidateFilterStatus('');
        const value = e.target.value;
        const filteredLead = value ? candidateDataCopy?.filter(elem => elem?.leader === value) : candidateDataCopy;
        setCandidateData(filteredLead);
        setCandidateFilterLead(value);
    }

    const handleStatusFilterChange = (e) => {
        setCandidateFilterLead('');
        const value = e.target.value;
        const filteredLead = value ? candidateDataCopy?.filter(elem => elem?.type === value) : candidateDataCopy;
        setCandidateData(filteredLead);
        setCandidateFilterStatus(value);
    }
    return (
        <div className='container'>
            <div className='d-flex flex-column justify-content-start py-3'>
                <div className='text-capitalize fw-bold'>Batch Name : {candidaDetails?.batch_name && candidaDetails?.batch_name}</div>
                <div className='text-capitalize fw-bold'>Exam Name : {candidaDetails?.name && candidaDetails?.name}</div>
                {/* <Button onClick={() => handleAddCandidate()} className='btn btn-sm' variant="outline-success">Add Candidate</Button> */}
            </div>
            <Form.Label style={{ fontWeight: '600' }}>Filter Lead</Form.Label>
            <Form.Select value={candidateFilterLead} onChange={handleLeadFilterChange} aria-label="Default select example">
                <option value=''>Select Lead</option>
                {
                    candidateLead?.map(elem => (
                        <option key={elem} value={elem}>{elem}</option>
                    ))
                }
            </Form.Select>
            <Form.Label style={{ fontWeight: '600' }}>Filter Status</Form.Label>
            <Form.Select value={candidateFilterStatus} onChange={handleStatusFilterChange} aria-label="Default select example">
                <option value=''>Select Status</option>
                {
                    candidateStatus?.map(elem => (
                        <option key={elem} value={elem}>{obj[elem]}</option>
                    ))
                }
            </Form.Select>
            {/* <Form.Control type="text" placeholder="Search Exam" /> */}
            <Table striped bordered hover responsive size="sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll No</th>
                        <th>Status</th>
                        <th>Leader</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? <Loader /> :
                            (candidateData || [])?.map(elem => (
                                <tr key={elem?.id} onClick={() => setCurrentId(elem?.roll_number)}>
                                    <td style={{ minWidth: '5rem' }}>{elem?.name}</td>
                                    <td style={{ minWidth: '5rem' }}>{elem?.roll_number}</td>
                                    <td style={{ minWidth: '9rem' }}><div style={{ color: elem?.type === 'completed' ? 'green' : elem?.type === 'pending' ? 'orange' : 'red' }}>{elem?.status}</div></td>
                                    <td style={{ minWidth: '5rem' }}>{elem?.leader}</td>
                                    <td className='d-flex gap-3'>
                                        <Button style={{ width: '8rem' }} onClick={() => navigate(`/evaluation-search/${id}/${batchId}/${elem?.roll_number}`)} className='btn btn-sm' variant="outline-success">View Submission</Button>
                                        {/* <Button className='btn btn-sm' variant="outline-success">Edit</Button>
                                        <Button onClick={(elem) => showConfirmationModal(elem?.id)} className='btn btn-sm' variant="outline-danger">{elem?.id === currentId && contentLoading ? <Loader /> : 'Delete'}</Button> */}
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </Table>
            {/* <Pagination>{items}</Pagination> */}
            <MessageModal show={showMessageModal} handleClose={closeMessModal} title="Exam Link" content={messageContent} />
            <ConfirmationModal show={showActiveConfirmationModal} title='Delete Exam' handleClose={handleCloseConfirmationModal} handleSubmit={handleDeleteExam} content='Are you sure you want to delete' />
            <CreateEditModal selectedAction={selectedAction} show={showModal} handleClose={handleClose} newData={newData} />
        </div>
    )
}

export default CandidateDetails