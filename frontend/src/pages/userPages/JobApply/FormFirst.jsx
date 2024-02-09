import React, { useEffect, useState } from "react";
import "./JobApply.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { MDBBtn, MDBInput, MDBValidation } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function FormFirst({ resume, handleFileChange, setActiveForm, questions }) {
  const [errorMsg, setErrorMsg] = useState(null);

  const handlesubmit = () => {
    try {
      if (resume && Array.isArray(questions) && questions.length > 0) {
        setActiveForm("second");
      } else {
        if (!resume) {
          setErrorMsg("Please provide a resume for the recruiter.");
        } else if (!Array.isArray(questions) || questions.length === 0) {
          setActiveForm("experience");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="m-sm-4">
        <MDBValidation noValidate className="row g-3" onSubmit={handlesubmit}>
          <div className="col-md-12">
            <MDBInput
              label=""
              type="file"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf"
              required
            />
            {errorMsg !== null && <p style={{ color: "red" }}>{errorMsg}</p>}
          </div>
          {resume && (
            <div className="col-md-12">
              <p>Uploaded Resume: {resume.name}</p>
            </div>
          )}
          <div className="col-12 d-flex justify-content-center">
            <MDBBtn
              style={{
                width: "50%",
                borderRadius: "50px",
                backgroundColor: "#387F8E",
                color: "white",
              }}
              className="mt-2"
              onClick={() => {
                handlesubmit;
              }}
            >
              Continue
            </MDBBtn>
          </div>
        </MDBValidation>
      </div>
    </>
  );
}

export default FormFirst;
