import React, { useEffect, useState } from "react";
import "./PostJob.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar";
import { MDBValidation, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import Select from "react-select"; // Import react-select
import countrydata from "../../../Utils/Countries";

import jobBanner from "../../../assets/job-Banner.png";

import "primeicons/primeicons.css";

function FormOne({
  jobRole,
  industryType,
  company,
  openings,
  location,
  setCompany,
  industries,
  setJobRole,
  handleOpeningsChange,
  handleCountryChange,
  handleIndustryChange,
  setActiveForm,
}) {
  const [errorMessages, setErrorMessages] = useState([]);

  const countryOptions = countrydata.map((country) => ({
    label: country.name,
    value: country.name,
  }));

  const industryOptions = industries.map((industry) => ({
    label: industry.industryName,
    value: industry.industryName,
    _id: industry._id,
  }));

  const openingsOption = Array.from({ length: 10 }, (_, index) => ({
    label: (index + 1).toString(),
    value: index + 1,
  }));

  const validateFormOne = () => {
    let errors = [];

    if (jobRole.trim() === "" || !jobRole) {
      errors.push("Add Job Role");
    }

    if (company.trim() === "" || !company) {
      errors.push("Add Company Name");
    }

    if (openings === null) {
      errors.push("Add openings");
    }

    if (location === null) {
      errors.push("Add location");
    }

    if (industryType === null) {
      errors.push("Add industry type");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
    } else {
      // Clear any previous errors if validation succeeds
      setErrorMessages([]);
      setActiveForm("second");
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
            <h4 className="ms-2">Add job basics</h4>
          </div>
          <img
            src={jobBanner}
            alt=""
            style={{ width: "200px", height: "150px", opacity: 0.7 }} // Adjust the opacity value as needed
          />
        </div>
        <MDBValidation noValidate>
          <div className="row p-3">
            <div className="col-sm-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label" style={{ fontWeight: "500" }}>
                Job Role
              </label>
              <MDBInput
                placeholder="enter job Role"
                label="Job Role"
                required
                invalid
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              ></MDBInput>
            </div>
            <div className="col-sm-12 col-md-6 mb-md-0 mb-3">
              <label className="form-label" style={{ fontWeight: "500" }}>
                Company Name
              </label>
              <MDBInput
                placeholder="enter company name"
                label="Company"
                required
                invalid
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              ></MDBInput>
            </div>
            <div className="col-sm-12 col-md-6 mb-md-0 mb-3">
              <label className="form-label" style={{ fontWeight: "500" }}>
                Openings
              </label>
              <Select
                options={openingsOption}
                isSearchable
                value={openings}
                onChange={handleOpeningsChange}
                required
              />
            </div>
            <div className="col-sm-12 col-md-3 mb-md-0 mb-3">
              <label className="form-label" style={{ fontWeight: "500" }}>
                Location
              </label>
              <Select
                options={countryOptions}
                isSearchable
                value={location}
                onChange={handleCountryChange}
                required
              />
            </div>
            <div className="col-sm-12 col-md-3 mb-md-0 mb-3">
              <label className="form-label" style={{ fontWeight: "500" }}>
                Industry
              </label>
              <Select
                options={industryOptions}
                isSearchable
                value={industryType} // Set value to the selected option itself, not label
                onChange={handleIndustryChange}
                required
              />
            </div>
            {errorMessages.length > 0 && (
              <div
                className="col-12 p-5 mb-2"
                style={{ backgroundColor: "#f2f2f2", borderRadius: "20px" }}
              >
                <p style={{ fontWeight: "500" }}>
                  <i className="pi pi-sync"></i> There are items above that need
                  your attention to continue.
                </p>
                <ul>
                  {errorMessages.map((error, index) => {
                    return <li key={index}>{error}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="d-flex align-items-center justify-content-end p-2">
            <MDBBtn onClick={() => validateFormOne()}>
              Next <i className="pi pi-angle-right"></i>
            </MDBBtn>
          </div>
        </MDBValidation>
      </div>
    </>
  );
}

export default FormOne;
