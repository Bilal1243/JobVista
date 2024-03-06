import React, { useEffect, useRef, useState } from "react";
import "./PostJob.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "primereact/button";
import { MDBValidation, MDBInput, MDBCheckbox, MDBBtn } from "mdb-react-ui-kit";
import Select from "react-select"; // Import react-select

import jobBanner from "../../../assets/job-banner-2.avif";
import { useRecruiterGetSkillsMutation } from "../../../redux/recruiterSlices/recruiterApiSlices";
import HighestEducations from "../../../Utils/Educations";

import "primeicons/primeicons.css";

const rates = [
  { name: "Per Year" },
  { name: "Per Month" },
  { name: "Per Week" },
  { name: "Per Day" },
  { name: "Per Hour" },
];

function FormThree({
  setActiveForm,
  handleRateChange,
  rate,
  salaryRange,
  setSalaryRange,
  experience,
  setExperience,
  skills,
  setSkills,
  qualification,
  handleQualificationChange,
}) {
  const minimumRef = useRef(null);
  const maximumRef = useRef(null);
  const expMinRef = useRef(null);
  const expMaxRef = useRef(null);
  const rateRef = useRef(null);
  const qualificationRef = useRef(null);
  const skillRef = useRef(null);
  const [notFilled, setNotFilled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSkills, setAllSkills] = useState([]);

  const [recruiterGetSkills] = useRecruiterGetSkillsMutation();

  const fetchSkills = async () => {
    try {
      const response = await recruiterGetSkills().unwrap();
      setAllSkills(response.data);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };
  useEffect(() => {
    fetchSkills();
  }, []);

  const rateOptions = rates.map((rate) => ({
    label: rate.name,
    value: rate.name,
  }));

  const skillOptions = allSkills.map((skill) => ({
    label: skill.skill,
    value: skill.skill,
    _id: skill._id,
  }));

  const educationOptions = HighestEducations.map((education) => ({
    label: education.name,
    value: education.name,
  }));

  const filteredSkillOptions = skillOptions.filter((skill) => {
    const isNotSelected = !(
      skills?.some((selectedSkill) => selectedSkill._id === skill._id) ?? false
    );
    return isNotSelected;
  });

  const handleSkillSelect = (selectedOption) => {
    // Add the selected skill to the state
    const newSkill = { _id: selectedOption._id, skill: selectedOption.value };

    setSkills([...skills, newSkill]);

    // Remove the selected skill from options
    setAllSkills((prevOptions) =>
      prevOptions.filter((option) => option.value !== selectedOption.value)
    );
  };

  const handleRemoveSkill = (index) => {
    // Remove the skill from the state
    const removedSkill = skills[index];

    // Add the removed skill back to options
    setAllSkills([...allSkills, removedSkill]);

    // Remove the selected skill from the state
    setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
  };

  const load = async () => {
    let errors = [];

    if (parseInt(salaryRange.minimum) > parseInt(salaryRange.maximum)) {
      errors.push("minimum pay must be lesser than maximum pay");
    }
    if (parseInt(salaryRange.minimum) <= 0) {
      errors.push("minimum pay must be greater than 0");
    }
    if (parseInt(salaryRange.maximum) <= 0) {
      errors.push("maximum pay must be greater than 0");
    }
    if (salaryRange.minimum.trim() === "") {
      errors.push("give valid Minimum pay");
    }
    if (salaryRange.maximum.trim() === "") {
      errors.push("give valid Maximum pay");
    }
    if (rate === null) {
      errors.push("select rate type");
    }
    if (experience.minimum.trim() === "") {
      errors.push("give valid input");
    }
    if (experience.maximum.trim() === "") {
      errors.push("give valid input");
    }
    if (parseInt(experience.minimum) > 25) {
      errors.push("give valid minimum experience");
    }
    if (parseInt(experience.maximum) > 25) {
      errors.push("give valid maximum experience");
    }
    if (parseInt(experience.minimum) >= parseInt(experience.maximum)) {
      errors.push("minimum experience must be lesser than maximum");
    }
    if (parseInt(experience.minimum) < 0) {
      errors.push("minimum experience must be valid");
    }
    if (parseInt(experience.maximum) <= 0) {
      errors.push("maximum experience must be valid");
    }
    if (qualification === null) {
      errors.push("select required qualification");
    }
    if (skills.length === 0) {
      errors.push("select any skills, it boosts your post");
    }

    console.log(errors);

    if (errors.length > 0) {
      setNotFilled(errors);
    } else {
      // Clear any previous errors if validation succeeds
      setNotFilled([]);
      // Simulate an asynchronous action with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setActiveForm("last");
    }
  };

  return (
    <>
      <div className="col-md-12 card-body p-3">
        <div
          className="col-12 d-flex justify-content-between align-items-center p-5"
          style={{ backgroundColor: "#fafafa", borderRadius: "15px" }}
        >
          <div className="text-bottom">
            <h4 className="ms-3">Add Pay and Others</h4>
          </div>
          <img
            className=""
            src={jobBanner}
            alt=""
            style={{ width: "250px", height: "175px", opacity: 0.7 }} // Adjust the opacity value as needed
          />
        </div>
        <MDBValidation noValidate>
          <div className="col-sm-12 col-md-12 mb-3 mb-md-0 p-5">
            <div className="row align-items-center">
              <div className="row">
                <h5 className="mb-3" style={{ fontWeight: "500" }}>
                  Pay
                </h5>
                <div className="col-md-4 mb-2 mt-md-0">
                  <label className="form-label">Minimum</label>
                  <MDBInput
                    ref={minimumRef}
                    type="number"
                    placeholder="Minimum Pay"
                    value={salaryRange.minimum}
                    required
                    invalid
                    onChange={(e) =>
                      setSalaryRange({
                        ...salaryRange,
                        minimum: e.target.value,
                      })
                    }
                  ></MDBInput>
                </div>
                <div className="col-md-4 mb-2 mt-md-0">
                  <label className="form-label">Maximum</label>
                  <MDBInput
                    ref={maximumRef}
                    placeholder="Maximum Pay"
                    type="number"
                    value={salaryRange.maximum}
                    required
                    invalid
                    onChange={(e) =>
                      setSalaryRange({
                        ...salaryRange,
                        maximum: e.target.value,
                      })
                    }
                  ></MDBInput>
                </div>
                <div className="col-md-4 mb-2 mt-md-0">
                  <label className="form-label">Rate</label>
                  <Select
                    ref={rateRef}
                    options={rateOptions}
                    onChange={handleRateChange}
                    value={rate}
                    isSearchable
                  ></Select>
                </div>
              </div>
            </div>
            <hr />
            <div className="row mt-5">
              <h5 className="mb-3" style={{ fontWeight: "500" }}>
                Experience
              </h5>
              <div className="col-md-4 mb-2 mt-md-0">
                <label className="form-label">Minimum</label>
                <MDBInput
                  ref={expMinRef}
                  type="number"
                  placeholder="Minimum Experience Required"
                  value={experience.minimum}
                  required
                  invalid
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      minimum: e.target.value,
                    })
                  }
                ></MDBInput>
              </div>
              <div className="col-md-4 mb-2 mt-md-0">
                <label className="form-label">Maximum</label>
                <MDBInput
                  ref={expMaxRef}
                  placeholder="Maximum Experience Required"
                  type="number"
                  value={experience.maximum}
                  required
                  invalid
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      maximum: e.target.value,
                    })
                  }
                ></MDBInput>
              </div>
              <div className="col-md-4 mb-2 mt-md-0">
                <label className="form-label">Required Qualification</label>
                <Select
                  ref={qualificationRef}
                  options={educationOptions}
                  value={qualification}
                  onChange={handleQualificationChange}
                  isSearchable
                ></Select>
              </div>
            </div>
            <hr />
            <div className="row mt-5">
              <h5 className="mb-3" style={{ fontWeight: "500" }}>
                Select Some skill that needs for the Applicants
              </h5>
              <div className="col-12">
                <Select
                  ref={skillRef}
                  options={filteredSkillOptions}
                  isSearchable
                  onChange={handleSkillSelect}
                />
              </div>
              <div className="row">
                {skills.map((skill, index) => (
                  <div
                    className="col-6 mb-md-0 mb-3 d-flex align-items-center justify-content-between"
                    style={{
                      width: "150px", // Set a specific width for each option
                      marginLeft: "10px", // Adjust the left margin
                      backgroundColor: "#f0f0f0",
                      color: "#000",
                      padding: "15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveSkill(index)}
                  >
                    {skill.skill}
                    <i className="pi pi-times" style={{ fontSize: "14px" }}></i>
                  </div>
                ))}
              </div>
              {notFilled.length > 0 && (
                <div
                  className="col-12 p-5 mb-2"
                  style={{ backgroundColor: "#f2f2f2", borderRadius: "20px" }}
                >
                  <p style={{ fontWeight: "500" }}>
                    <i className="pi pi-sync"></i> There are items above that
                    need your attention to continue.
                  </p>
                  <ul>
                    {notFilled.map((error, index) => {
                      return <li key={index}>{error}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between p-1">
            <Button
              label="Back"
              icon="pi pi-angle-left"
              iconPos="left"
              style={{ borderRadius: "20px" }}
              raised
              onClick={() => setActiveForm("second")}
            />
            <MDBBtn onClick={() => load()}>
              Continue <i className="pi pi-angle-right"></i>
            </MDBBtn>
          </div>
        </MDBValidation>
      </div>
    </>
  );
}

export default FormThree;
