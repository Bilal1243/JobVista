import React, { useEffect, useState } from "react";
import "./PostJob.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar";

import {
  useRecruiterGetIndustryTypesMutation,
  useRecruiterPostJobMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";
import FormThree from "./FormThree";
import LastForm from "./LastForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

const jobTypes = [
  { name: "Freelance" },
  { name: "Remote" },
  { name: "Full-Time" },
  { name: "Part-Time" },
  { name: "Temporary" },
  { name: "Internship" },
];

function PostJob() {
  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [jobRole, setJobRole] = useState("");
  const [jobType, setJobType] = useState([]);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState(null);
  const [openings, setOpenings] = useState(null);
  const [industryType, setIndustryType] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [rate, setRate] = useState(null);
  const [salaryRange, setSalaryRange] = useState({ minimum: "", maximum: "" });
  const [experience, setExperience] = useState({ minimum: "", maximum: "" });
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [contactAllowed, setContactAllowed] = useState(false);
  const [qualification, setQualification] = useState(null);

  const [activeForm, setActiveForm] = useState("first");
  const [isDeadline, setIsDeadline] = useState(null);

  const [industries, setIndustries] = useState([]);

  const navigate = useNavigate()

  const [recruiterGetIndustryTypes] = useRecruiterGetIndustryTypesMutation();
  const [recruiterPostJob] = useRecruiterPostJobMutation();

  const fetchIndustries = async () => {
    try {
      const response = await recruiterGetIndustryTypes().unwrap();
      setIndustries(response.data);
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleQualificationChange = (selectedOption) => {
    setQualification(selectedOption);
  };

  const handleCountryChange = (selectedOption) => {
    setLocation(selectedOption);
  };

  const handleIndustryChange = (selectedOption) => {
    setIndustryType(selectedOption);
  };

  const handleOpeningsChange = (selectedOption) => {
    setOpenings(selectedOption);
  };

  const handleRateChange = (selectedOption) => {
    setRate(selectedOption);
  };

  const createPost = async () => {
    try {
      const response = await recruiterPostJob({
        recruiterId: recruiterData._id,
        jobRole,
        company,
        industryType: industryType._id,
        qualification: qualification.value,
        rate: rate.value,
        openings: openings.value,
        location: location.value,
        skills,
        experience,
        salaryRange,
        jobType,
        deadline,
        description,
        contactAllowed,
        questions
      }).unwrap();
      if(response.success){
        toast.success('Job Posted Successfully')
        navigate('/myJobs')
      }
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  return (
    <>
      <RecruiterNavbar></RecruiterNavbar>
      <div className="container" style={{ marginTop: "150px" }}>
        <div className="card">
          {activeForm === "first" && (
            <FormOne
              jobRole={jobRole}
              company={company}
              openings={openings}
              industryType={industryType}
              location={location}
              setCompany={setCompany}
              setJobRole={setJobRole}
              handleOpeningsChange={handleOpeningsChange}
              handleCountryChange={handleCountryChange}
              handleIndustryChange={handleIndustryChange}
              industries={industries}
              setActiveForm={setActiveForm}
            ></FormOne>
          )}
          {activeForm === "second" && (
            <FormTwo
              setActiveForm={setActiveForm}
              setJobType={setJobType}
              jobType={jobType}
              deadline={deadline}
              setDeadline={setDeadline}
              isDeadline={isDeadline}
              setIsDeadline={setIsDeadline}
              description={description}
              setDescription={setDescription}
            ></FormTwo>
          )}
          {activeForm === "third" && (
            <FormThree
              setActiveForm={setActiveForm}
              rate={rate}
              handleRateChange={handleRateChange}
              salaryRange={salaryRange}
              setSalaryRange={setSalaryRange}
              experience={experience}
              setExperience={setExperience}
              skills={skills}
              setSkills={setSkills}
              qualification={qualification}
              handleQualificationChange={handleQualificationChange}
            ></FormThree>
          )}
          {activeForm === "last" && (
            <LastForm
              setActiveForm={setActiveForm}
              activeForm={activeForm}
              questions={questions}
              setQuestions={setQuestions}
              contactAllowed={contactAllowed}
              setContactAllowed={setContactAllowed}
              createPost={createPost}
            ></LastForm>
          )}
        </div>
      </div>
    </>
  );
}

export default PostJob;
