import React, { useEffect, useState } from 'react';
import { Button, Pagination, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/UI/Loader';
import ConfirmationModal from '../../Modal/ConfirmationModal';
import CreateEditModal from '../../Modal/CreateEditExamModal';
import MessageModal from '../../Modal/MessageModal';
import { getBatchDetails } from '../../services/batch';
import { deleteExamData, getExamDeatilsData } from '../../services/exam';

function Admin() {
    const [showModal, setShowModal] = useState(false);
    const [showActiveConfirmationModal, setShowActiveConfirmationModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [batchData, setBatchData] = useState([]);
    const [selectedAction, setSelectedAction] = useState({
        title: '',
        isEdit: false,
        data: {}
    });
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

    const handleEditExam = () => {
        // setSelectedAction
    }

    const handleAddExam = () => {
        // setSelectedAction
        handleShow();
        setSelectedAction({
            title: 'Add Exam Name',
            isEdit: false,
            data: {},
            type: 'addExam'
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

    const getExamData = async () => {
        setLoading(true);
        const res = await getExamDeatilsData();
        const batchData = await getBatchDetails()
        setBatchData(batchData || []);
        console.log({ res });
        setExamData(res);
        setLoading(false);
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

    const showMessModal = (id, batchId) => {
        console.log({ id, h: `${window.location.origin}/exam/${id}` })
        // setCurrentId(id);
        // setShowActiveConfirmationModal(true);
        setMessageContent(`${window.location.origin}/candidate-exam/${batchId}/${id}`);
        setShowMessageModal(true);
    }

    const closeMessModal = () => {
        setShowMessageModal(false);
    }

    const handleCloseConfirmationModal = () => {
        setShowActiveConfirmationModal(false);
    }
    useEffect(() => {
        getExamData()
    }, [])
    return (
        <div className='container'>
            <div className='d-flex justify-content-between align-items-center py-3'>
                <div>Dashboard</div>
                <Button onClick={() => handleAddExam()} className='btn btn-sm' variant="outline-success">Add Exam</Button>
            </div>
            {/* <Form.Control type="text" placeholder="Search Exam" /> */}
            <Table striped bordered hover responsive="sm" size="sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Batch</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? <Loader /> :
                            examData?.map(elem => (
                                <tr key={elem?.id} onClick={() => setCurrentId(elem?.id)}>
                                    <td>{elem?.name}</td>
                                    <td>{elem?.batch_name}</td>
                                    <td className='d-flex gap-3'>
                                        {/* <Button className='btn btn-sm' variant="outline-success">Edit</Button> */}
                                        <Button onClick={() => navigate(`/candidate-details/${elem?.batch_id}/${elem?.id}`)} className='btn btn-sm' variant="outline-success">Details</Button>
                                        <Button onClick={() => showMessModal(elem?.id, elem?.batch_id)} className='btn btn-sm' variant="outline-success">Link</Button>
                                        <Button onClick={(elem) => showConfirmationModal(elem?.id)} className='btn btn-sm' variant="outline-danger">{elem?.id === currentId && contentLoading ? <Loader /> : 'Delete'}</Button>
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </Table>
            {/* <Pagination>{items}</Pagination> */}
            <MessageModal show={showMessageModal} handleClose={closeMessModal} title="Exam Link" content={messageContent} />
            <ConfirmationModal show={showActiveConfirmationModal} title='Delete Exam' handleClose={handleCloseConfirmationModal} handleSubmit={handleDeleteExam} content='Are you sure you want to delete' />
            <CreateEditModal batchData={batchData} selectedAction={selectedAction} show={showModal} handleClose={handleClose} newData={newData} />
        </div>
    )
}

export default Admin