import React, { useEffect, useState } from "react";
import "./JobApply.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

function FormThree({
  title,
  setTitle,
  company,
  setCompany,
  setActiveForm,
  handleSubmit,
}) {
  return (
    <>
      <div className="m-sm-4">
        <div className="col-md-12 mb-3">
          <MDBInput
            label="Job Title"
            type="text"
            name="JobTitle"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="col-md-12 mb-3">
          <MDBInput
            label="Company"
            type="text"
            name="company"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div className="col-12 d-flex justify-content-center">
          <MDBBtn
            style={{
              width: "50%",
              borderRadius: "50px",
              backgroundColor: "#387F8E",
              color: "white",
            }}
            className="mt-2"
            type="submit"
            onClick={handleSubmit}
          >
            Finish
          </MDBBtn>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button
            style={{
              width: "30%",
              borderRadius: "50px",
              backgroundColor: "black",
              color: "white",
              padding: "10px",
              border: "none",
            }}
            onClick={() => {
              setActiveForm("second");
            }}
            type="button"
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
}

export default FormThree;
