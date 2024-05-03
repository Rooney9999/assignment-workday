import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Alert, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCandidateDetails } from '../Store/CandidateSlice';
import StatusCode from '../utils/StatusCode';
import { AiFillThunderbolt } from "react-icons/ai";
import { Link } from 'react-router-dom';
import Filter from './Filter';
import img from '../Assets/img.png'
import image from '../Assets/image.png'
import '../Styles/Details.css'

const Details = () => {
    const [show, setShow] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();
    const { data: candidateDetails, status } = useSelector(state => state?.candidates);
    const [page, setPage] = useState(1);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const limit = 10;

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = () => {
        dispatch(getCandidateDetails({ limit: page * limit }));
    };

    const fetchMoreData = () => {
        setPage(page + 1);
    };

    useEffect(() => {
        setFilteredCandidates(candidateDetails);
    }, [candidateDetails]);

    if (status === StatusCode.LOADING && page === 1) {
        return <p>Loading...</p>;
    }

    if (status === StatusCode.ERROR) {
        return <Alert key="danger" variant='danger'>Something went wrong!!! Please try again later</Alert>;
    }

    const handleViewJob = (candidate) => {
        setSelectedCandidate(candidate);
        handleShow();
    };

    return (
        <div>
            <Filter setFilteredCandidates={setFilteredCandidates} candidateDetails={candidateDetails} />
            
            <div>
                <InfiniteScroll
                    dataLength={filteredCandidates.length}
                    next={fetchMoreData}
                    hasMore={filteredCandidates?.length % limit === 0}
                    loader={filteredCandidates?.length < 0 && <p>Loading items...</p>}
                    endMessage={<p>No more items</p>}>
                    <div className='container details'>
                        <div className='row'>
                            {filteredCandidates?.length > 0 ? <>  {filteredCandidates.map(candidate => (
                                <div className='col-md-4' style={{ marginBottom: '10px' }} key={candidate.id}>
                                    <Card className='h-100'>
                                        <Card.Body>
                                            <div className='applicant'>
                                                <Card.Title><p>{candidate.jobRole}</p></Card.Title>
                                                <Card.Text><p className='location'>{candidate.location}</p></Card.Text>
                                                <Card.Text><p className='min-salary'>Minimum Experience: {candidate.minJdSalary}</p></Card.Text>
                                                <Card.Text>
                                                    <p className='about-company'>About Company:</p>
                                                    <p className='about-us'>About Us</p>
                                                    <p className='about-details'>{candidate.jobDetailsFromCompany}</p>
                                                </Card.Text>
                                                <div className="">
                                                    <div className='blurring'><p></p></div>
                                                    <div className='views'>
                                                        <p onClick={() => handleViewJob(candidate)} className=''>View Job</p>
                                                    </div>
                                                </div>
                                                <Card.Text>
                                                    <div className='experience'>
                                                        <p className='minimum'>Minimum Experience:</p>
                                                        <p className='year'>{candidate.minExp} years</p>
                                                    </div>
                                                </Card.Text>
                                            </div>
                                        </Card.Body>
                                        <Link to={'https://weekday.works'}><button className='easy'><span className='thunder'><AiFillThunderbolt /></span> Easy Apply</button></Link>
                                        <div className='unlock'>
                                            <img src={img} class="" alt="" />
                                            <img src={image} class="" alt="" />
                                            <span className=''>Unlock referral asks</span>
                                        </div>
                                    </Card>
                                </div>
                            ))}</> : <div>
                                No data Available
                            </div>}
                        </div>
                    </div>
                </InfiniteScroll>
            </div>
            {selectedCandidate && 
                <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter p-2" centered>
                    
                    <Modal.Body>
                        <h3 className='text-center'>Job Description</h3>
                        {selectedCandidate.jobDetailsFromCompany}
                    </Modal.Body>
                </Modal>
            }
        </div>
    );
}

export default Details;
