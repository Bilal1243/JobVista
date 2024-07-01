import { React, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Dropdown } from 'primereact/dropdown';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBIcon,
    MDBInput,
    MDBValidation,
    MDBValidationItem,
} from 'mdb-react-ui-kit'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

import { useAddJobPreferenceMutation } from '../../../../redux/userSlices/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function JobPreference() {


    const jobTypeOptions = [
        { val: 'Full-Time' },
        { val: 'Part-Time' },
        { val: 'Contract' },
        { val: 'Temporary' },
        { val: 'Freelance' },
    ];

    const [jobTitle, setJobtitle] = useState('')
    const [jobType, setJobtype] = useState(jobTypeOptions[0].val)
    const [minPay, setMinpay] = useState(0)

    const {id} = useParams()

    const [addJobPreference] = useAddJobPreferenceMutation()
    const navigate = useNavigate()



    const selectedJobTYpe = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.val}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const JobtypeOptionsTemp = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.val}</div>
            </div>
        );
    };


    const addJobPreferences = async () => {
        try {
            const responseFromApiCall = await addJobPreference({ userId: id, jobTitle, jobType, minPay }).unwrap()
            if (responseFromApiCall) {
                toast.success(responseFromApiCall?.data?.message)
                navigate(`/addSkills/${id}`)
            }
        } catch (error) {
            toast.error(error?.data?.message || error?.data)
        }
    }

    return (
        <>
            <div className="card flex justify-content-center align-items-center pt-5">
                        <div style={{ flex: 1, maxWidth: '450px', margin: '0 15px' }}>
                            <MDBCard alignment="center" className="mb-5">
                                <MDBIcon fas icon="user-circle" className="fa-3x " />

                                <MDBCardBody>
                                    <MDBValidation
                                        noValidate
                                        className="row g-3"
                                        onSubmit={addJobPreferences}
                                    >
                                        <div className="col-md-12">
                                            <MDBValidationItem
                                                className="col-md-12"
                                                feedback="Please Enter Job Title"
                                                invalid
                                            >
                                                <MDBInput
                                                    label="Job Title"
                                                    type="text"
                                                    name="jobTitle"
                                                    value={jobTitle}
                                                    onChange={(e) => setJobtitle(e.target.value)}
                                                    required
                                                    validation="Enter the Job Title"
                                                    invalid
                                                />
                                            </MDBValidationItem>
                                        </div>
                                        <div className="col-md-12">
                                            <MDBValidationItem
                                                className="col-md-12"
                                                feedback="Please Enter Job Type"
                                                invalid
                                            >
                                                <Dropdown value={jobType} onChange={(e) => setJobtype(e.value)} options={jobTypeOptions} optionLabel="name" placeholder="Select Job Type"
                                                    filter valueTemplate={selectedJobTYpe} itemTemplate={JobtypeOptionsTemp} className="w-100" />
                                            </MDBValidationItem>
                                        </div>
                                        <div className="col-md-12">
                                            <MDBValidationItem
                                                className="col-md-12"
                                                feedback="Please Enter Expected CTC(year)"
                                                invalid
                                            >
                                                <MDBInput
                                                    label="Expected CTC/year"
                                                    type="number"
                                                    name="minPay"
                                                    value={minPay}
                                                    onChange={(e) => setMinpay(e.target.value)}
                                                    required
                                                    validation="Enter the Expected CTC"
                                                    invalid
                                                />
                                            </MDBValidationItem>
                                        </div>
                                        <div className="col-12">
                                            <MDBBtn
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '50px',
                                                    backgroundColor: '#387F8E',
                                                    color: 'white',
                                                }}
                                                className="mt-2"
                                            >
                                                Add
                                            </MDBBtn>
                                        </div>
                                    </MDBValidation>
                                    <div className="col-12">
                                        <MDBBtn
                                        type='button'
                                            style={{
                                                width: '100%',
                                                borderRadius: '50px',
                                                backgroundColor: '#387F8E',
                                                color: 'white',
                                            }}
                                            className="mt-2"
                                            onClick={()=>navigate(`/addSkills/${id}`)}
                                        >
                                            Skip
                                        </MDBBtn>
                                    </div>
                                </MDBCardBody>
                                <p style={{ textAlign: 'center' }}></p>
                                <MDBCardFooter className="mb-2"></MDBCardFooter>
                            </MDBCard>
                        </div>
                    </div>
        </>
    )
}

export default JobPreference