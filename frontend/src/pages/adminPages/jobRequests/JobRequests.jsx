import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import AdminNavbar from '../../../components/adminComponents/Navbar/adminNavbar'
import { toast } from 'react-toastify'
import './jobRequests.css'
import "primeflex/primeflex.css";
import { useAdminAcceptJobMutation, useAdminGetJobRequestsMutation } from '../../../redux/adminSlices/adminApiSlice'

function JobRequests() {
    const [visible, setVisible] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [adminJobRequests] = useAdminGetJobRequestsMutation();
    const [adminAcceptJob] = useAdminAcceptJobMutation()

    const fetchData = async () => {
        try {
            const responseFromApiCall = await adminJobRequests();

            const jobsArray = responseFromApiCall.data.data;
            setJobs(jobsArray);
        } catch (error) {
            console.error("Error fetching job requests:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAgree = async () => {
        try {
            const response = await adminAcceptJob({ id: selectedJob._id }).unwrap()
            if (response.message) {
                toast.success(response.message)
                setShowModal(false)
            }
            fetchData()
        } catch (error) {
            toast.error(error?.data?.message || error?.data)
        }
    };

    const calculateTimePassed = (createdAt) => {
        const currentDate = new Date();
        const createdDate = new Date(createdAt);
        const timeDifference = currentDate - createdDate;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        if (days === 0) {
            return { hours, minutes };
        }
        else {
            return { days, hours, minutes };
        }
    };


    return (
        <>
            <AdminNavbar></AdminNavbar>
            <div className='p-4 shadow-2 border-round container'>
                {jobs.length > 0 ? (
                    <>
                        <div className="text-3xl font-medium text-900 mb-3">Job Requests</div>
                        <div className="card-container">
                            {
                                jobs.map((job, index) => (
                                    <div key={index} className="card-wrapper">
                                        <Card
                                            title={
                                                <span className="title">
                                                    {job.jobRole}
                                                </span>
                                            }
                                            subTitle={<span className="subTitle">{job.company}</span>}
                                            className="small-card zoom-in-card"
                                            role="region"
                                        >
                                            <div>
                                                <strong className="mobilead">Industry:</strong> {job.industryType[0]}
                                            </div>
                                            <div>
                                                <strong className="mobilead">Email:</strong> {job.email}
                                            </div>
                                            <div>
                                                <strong className="mobilead">Mobile:</strong> {job.mobile}
                                            </div>
                                            <div>
                                                <strong className="mobilead">created on:</strong>
                                                {calculateTimePassed(job.createdAt).days > 0 && (
                                                    <span>{calculateTimePassed(job.createdAt).days} days, </span>
                                                )}
                                                {calculateTimePassed(job.createdAt).hours > 0 && (
                                                    <span>{calculateTimePassed(job.createdAt).hours} hours, </span>
                                                )}
                                                {calculateTimePassed(job.createdAt).minutes} minutes ago
                                            </div>
                                            <div className="button-container mt-3">
                                                <div className="button-wrapper">
                                                    <Button
                                                        label="Detailed View"
                                                        icon="pi pi-image"
                                                        onClick={() => {
                                                            setSelectedJob(job);
                                                            setVisible(true);
                                                        }}
                                                    />
                                                </div>
                                                <div className="button-wrapper">
                                                    <Button
                                                        className="btnagree"
                                                        label="Accept Job Post"
                                                        onClick={() => {
                                                            setSelectedJob(job);
                                                            setShowModal(true);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <h3 style={{ textAlign: 'center' }}>No Job Requests </h3>
                )}
            </div>

            {/* Detailed View Dialog */}
            <Dialog
                visible={visible}
                style={{ width: '40%' }}
                onHide={() => setVisible(false)}
                header="Job Details"
                modal
            >
                {selectedJob && (
                    <>
                        <Card
                            className="small-card zoom-in-card"
                            role="region"
                        >
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <strong className="mobilead">Job Role:</strong> {selectedJob.jobRole}
                            </div>
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <strong className="mobilead">Company:</strong> {selectedJob.company}
                            </div>
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <strong className="mobilead">Industry:</strong> {selectedJob.industryType[0]}
                            </div>
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <strong className="mobilead">Email:</strong> {selectedJob.email}
                            </div>
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <strong className="mobilead">Mobile:</strong> {selectedJob.mobile}
                            </div>
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <strong className="mobilead">location:</strong> {selectedJob.location}
                            </div>
                            <div style={{ display: 'block', textAlign: 'center' }}>
                                <strong className="mobilead">Salary:</strong> {selectedJob.salaryRange.starting} - {selectedJob.salaryRange.ending}
                            </div>
                        </Card>
                    </>
                )}
            </Dialog>

            {/* Accept Job Dialog */}
            <Dialog
                visible={showModal}
                style={{ width: '30%' }}
                onHide={() => setShowModal(false)}
                header="Confirm Job Acceptance"
                modal
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={() => setShowModal(false)}
                            style={{ backgroundColor: '#FF5733', marginRight: '10px' }}
                        />
                        <Button
                            label="Accept"
                            icon="pi pi-check"
                            onClick={handleAgree}
                            style={{ backgroundColor: '#4CAF50' }}
                        />
                    </div>
                }
            >
                {selectedJob && (
                    <p>{`do you want to make it live?`}</p>
                )}
            </Dialog>
        </>
    );
}

export default JobRequests;
