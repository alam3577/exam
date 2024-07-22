// src/CreateEditModal.js
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Loader from '../components/UI/Loader';
import { createExam, updateCandidateDetails } from '../services/exam';

const CreateEditModal = ({ show, handleClose, newData, batchData, selectedAction, batc }) => {
    console.log({batchData})
    const { title, isEdit, data, placeholder, type, action } = selectedAction || {};
    const [inputValue, setInputValue] = useState('');
    const [inputRollNo, setInputRollNo] = useState('');
    const [inputPlace, setInputPlace] = useState('');
    const [inputBatch, setInputBatch] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const onChange = (e) => {
        setInputValue(e.target.value);
    };

    const onSubmit = async () => {
        if (!inputValue) {
            toast.error('Exam name is required')
            return;
        }
        console.log({inputBatch})
        if (!inputBatch?.name || !inputBatch?.id) {
            toast.error('Please select the semester')
            return;
        }
        try {
            if (isEdit) {

            } else {
                setLoading(true)
                const res = await createExam({
                    name: inputValue,
                    batch_id: inputBatch?.id,
                    batch_name: inputBatch?.name,
                });
                console.log({ res })
                newData({ type: 'add', data: res });
                toast.success('Exam created');
            }
        } catch (error) {
            toast.error(`Failed to ${isEdit ? 'Edit' : 'Add'} the exam, please try again`)
        } finally {
            setLoading(false);
            setInputValue('');
        }

        handleClose();
    };

    const onCandidateDetailsSubmit = async () => {
        try {
            if (action === 'edit') {

            } else if (action === 'add') {
                setLoading(true)
                const res = await updateCandidateDetails({
                    id: id,
                    newCandidate: {
                        candidate_name: inputValue,
                        place: inputPlace,
                        roll_number: inputRollNo
                    }
                });
                console.log({ res })
                newData({ type: 'add', data: res });
                toast.success('Exam created');
            }
        } catch (error) {
            toast.error(`Failed to ${action === 'add' ? 'Add' : 'Edit'} the Candidate, please try again`)
        } finally {
            setLoading(false);
            // setInputValue('');
            // setInputValue('');
            // setInputValue('');
        }
        // handleClose();
    };

    const handleBatchChange = (id) => {
        const res = batchData?.find(elem => elem?.id === id);
        setInputBatch(prevState => {
            return {...prevState, id: id, name: res?.name}
        })
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='d-flex flex-column gap-2'>
                    {type === "addExam" ?
                    <>
                    <Form.Label style={{ fontWeight: '600' }}>Select Batch</Form.Label>
                    <Form.Select onChange={(e) => handleBatchChange(e.target.value)} aria-label="Default select example">
                        <option value="">Select Batch</option>
                        {(batchData || [])?.map(elem => (
                            <option value={elem?.id}>{elem?.name}</option>
                        ))}
                    </Form.Select> </> : null}
                    
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{ fontWeight: '600' }}>{placeholder || "Enter Exam"}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={placeholder || "Enter Exam"}
                            value={inputValue}
                            onChange={onChange}
                        />
                    </Form.Group>
                    {type === 'candidateDetails' &&
                        <div className='d-flex flex-column gap-2'>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{ fontWeight: '600' }}>Roll No</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder='Enter Roll No'
                                    value={inputRollNo}
                                    onChange={(e) => setInputRollNo(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label style={{ fontWeight: '600' }}>Place</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder='Enter Place'
                                    value={inputPlace}
                                    onChange={(e) => setInputPlace(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button disabled={loading} variant="success" onClick={type === 'candidateDetails' ? onCandidateDetailsSubmit : onSubmit}>
                    {
                        loading ? <Loader /> : 'Submit'
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateEditModal;
