import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBIcon,
    MDBValidation
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import Select from 'react-select';

import { useNavigate } from 'react-router-dom';
import { useGetSkillsMutation, useAddSkillsMutation } from '../../../redux/userSlices/userApiSlice';
import { useParams } from 'react-router-dom';

function SkillUi() {
    const [skillContainer, setSkillContainer] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState([]);

    const navigate = useNavigate();

    const [getSkills] = useGetSkillsMutation();
    const [addSkills] = useAddSkillsMutation();

    const { id } = useParams()

      

    const removeSkill = (index) => {
        const updatedSkills = [...skills];
        updatedSkills.splice(index, 1);
        setSkills(updatedSkills);
    };

    const fetchSkills = async () => {
        try {
            const response = await getSkills();
            setSkillContainer(response.data.data);
        } catch (error) {
            console.log(error?.data?.message || error?.data);
        }
    };

    const handleSkillChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedSkill('');
            setSkills((prevSkills) => [
                ...prevSkills,
                { _id: selectedOption._id, skill: selectedOption.label },
            ]);
        }
    };
      

    const skillOption = skillContainer.map((skills) => ({
        value: skills.skill,
        label: skills.skill,
        _id: skills._id,
    }));

    useEffect(() => {
        fetchSkills();
    }, []);

    const saveSkill = async () => {
        try {
            if (skills.length === 0) {
                toast.error('Add your skills');
            } else {
                const responseFromApiCall = await addSkills({ userId: id, skills }).unwrap();
                if (responseFromApiCall) {
                    navigate('/login');
                }
            }
        } catch (error) {
            toast.error(error?.data?.message || error?.data);
        }
    };

    console.log(skills)

    return (
        <>
            <div className="card flex justify-content-center">
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ flex: 1, maxWidth: '450px', margin: '0 15px' }}>
                        <MDBCard alignment="center" className="mt-5">

                            <MDBCardBody>
                                <MDBValidation
                                    noValidate
                                    className="row g-3"
                                    onSubmit={() => saveSkill()}
                                >
                                    <div className="col-md-12">
                                            <Select
                                                options={skillOption}
                                                value={selectedSkill}
                                                onChange={handleSkillChange}
                                                isSearchable
                                            />
                                    </div>
                                    <div className="col-12">
                                        {skills.map((skill, index) => (
                                            <div
                                                key={index}
                                                className="d-flex align-items-center justify-content-between mt-2"
                                            >
                                                <div>{skill.skill}</div>
                                                <MDBIcon
                                                    icon="times"
                                                    onClick={() => removeSkill(index)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-12">
                                        <MDBBtn
                                            type="submit"
                                            style={{
                                                width: '100%',
                                                borderRadius: '50px',
                                                backgroundColor: '#387F8E',
                                                color: 'white',
                                                marginTop: '10px',
                                            }}
                                        >
                                            Finish
                                        </MDBBtn>
                                    </div>
                                </MDBValidation>
                                <MDBBtn
                                    type="button"
                                    style={{
                                        width: '100%',
                                        borderRadius: '50px',
                                        backgroundColor: '#387F8E',
                                        color: 'white',
                                        marginTop: '10px',
                                    }}
                                    onClick={() => navigate('/login')}
                                >
                                    Skip
                                </MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SkillUi;
