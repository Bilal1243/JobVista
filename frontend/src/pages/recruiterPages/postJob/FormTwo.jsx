import React, { useEffect, useState } from "react";
import "./PostJob.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar";
import { Button } from "primereact/button";
import {
  MDBValidation,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBTextArea,
} from "mdb-react-ui-kit";
import Select from "react-select"; // Import react-select
import countrydata from "../../../Utils/Countries";

import jobBanner from "../../../assets/job-banner-2.avif";

import "primeicons/primeicons.css";

const jobTypes = [
  { name: "Freelance" },
  { name: "Remote" },
  { name: "Full-Time" },
  { name: "Part-Time" },
  { name: "Temporary" },
  { name: "Internship" },
];

function FormTwo({
  setActiveForm,
  jobType,
  setJobType,
  setDeadline,
  deadline,
  isDeadline,
  setIsDeadline,
  setDescription,
  description,
}) {
  const [notFilled, setNotFilled] = useState([]);

  const toggleJobType = (selectedJobType) => {
    if (jobType.includes(selectedJobType)) {
      // If job type is already selected, remove it
      setJobType(jobType.filter((type) => type !== selectedJobType));
    } else {
      // If job type is not selected, add it
      setJobType([...jobType, selectedJobType]);
    }
  };

  const isMobile = window.innerWidth <= 767;

  const load = async () => {
    const currentDate = new Date();
    const deadlineFormal = new Date(deadline)

    let errors = [];

    if (jobType.length === 0) {
      errors.push("Select job type");
    }

    if (isDeadline === null) {
      errors.push("Select any options from deadline of application");
    }

    if (isDeadline === "Yes" && (!deadline || deadlineFormal <= currentDate)) {
      errors.push("Choose a proper future deadline");
    }

    if(description.trim() === '' || !description){
      errors.push("add description");
    }

    if (errors.length > 0) {
      setNotFilled(errors);
    } else {
      // Clear any previous errors if validation succeeds
      setNotFilled([]);
      // Simulate an asynchronous action with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setActiveForm("third");
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
            <h4 className="ms-3">Add Job Details</h4>
          </div>
          <img
            src={jobBanner}
            alt=""
            style={{ width: "250px", height: "175px", opacity: 0.7 }} // Adjust the opacity value as needed
          />
        </div>
        <MDBValidation noValidate>
          <div className="col-sm-12 col-md-12 mb-md-0 p-5">
            <div className="row align-items-center">
              <div className="col-12">
                <label
                  className="form-label mb-2"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  Job Type
                </label>
              </div>
              <div className="row d-flex flex-wrap align-items-center">
                {jobTypes.map((jobTypeObj, index) => {
                  const isSelected = jobType.includes(jobTypeObj.name);

                  return (
                    <div
                      key={index}
                      onClick={() => toggleJobType(jobTypeObj.name)}
                      className="col-12 mb-md-0 mb-3"
                      style={{
                        width: "150px", // Set a specific width for each option
                        marginLeft: "10px", // Adjust the left margin
                        marginRight: "10px", // Adjust the right margin
                        backgroundColor: isSelected ? "#4caf50" : "#f0f0f0",
                        color: isSelected ? "#fff" : "#000",
                        padding: "15px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {isSelected ? (
                        <i
                          className="pi pi-check"
                          style={{ fontSize: "14px" }}
                        ></i>
                      ) : (
                        <i
                          className="pi pi-plus"
                          style={{ fontSize: "14px" }}
                        ></i>
                      )}{" "}
                      {jobTypeObj.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <hr />
            <div className="col-12 mb-2 mt-2">
              <label className="mb-1" style={{ fontWeight: "500" }}>
                Is there any deadline for application?
              </label>
              <div class="form-check ">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="inlineCheckbox1"
                  value="Yes"
                  checked={isDeadline === "Yes"}
                  onClick={() => setIsDeadline("Yes")}
                />
                <label class="form-check-label" for="inlineCheckbox1">
                  Yes
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="inlineCheckbox1"
                  value="No"
                  checked={isDeadline === "No"}
                  onClick={() => setIsDeadline("No")}
                />
                <label class="form-check-label" for="inlineCheckbox1">
                  No
                </label>
              </div>
              {isDeadline === "Yes" && (
                <div className="col-6">
                  <MDBInput
                    label="set Date"
                    type="date"
                    required
                    invalid
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  ></MDBInput>
                </div>
              )}
            </div>
            <div className="col-12">
              <label className="mb-1" style={{ fontWeight: "500" }}>
                Job Description
              </label>
              <MDBTextArea
                placeholder="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></MDBTextArea>
            </div>
          </div>

          {notFilled.length > 0 && (
            <div
              className="col-12 p-5 mb-2"
              style={{ backgroundColor: "#f2f2f2", borderRadius: "20px" }}
            >
              <p style={{ fontWeight: "500" }}>
                <i className="pi pi-sync"></i> There are items above that need
                your attention to continue.
              </p>
              <ul>
                {notFilled.map((error, index) => {
                  return <li key={index}>{error}</li>;
                })}
              </ul>
            </div>
          )}
          <div className="d-flex align-items-center justify-content-between p-1">
            <Button
              label="Back"
              icon="pi pi-angle-left"
              iconPos="left"
              style={{ borderRadius: "20px" }}
              raised
              onClick={() => setActiveForm("first")}
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

export default FormTwo;
