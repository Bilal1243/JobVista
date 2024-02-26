import React from "react";
import "./style.css";
import { PROFILE_PATH, RESUME_PATH } from "../../../Utils/URL";
import defualtProfile from "../../../assets/defualtProfile.jpg";
import { Dropdown } from "primereact/dropdown";
import Loader from "../../Loader";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

function ApplicantView({ selectedApplicant, changeStatus, handleChange }) {
  return (
    <>
      <div className={`tab-pane active p-3`} id="saved-posts">
        {selectedApplicant !== null ? (
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-center">
                  <img
                    src={
                      selectedApplicant.ownerDetails.profileImg
                        ? PROFILE_PATH +
                          selectedApplicant.ownerDetails.profileImg
                        : defualtProfile
                    }
                    alt=""
                    style={{
                      width: "75px",
                      height: "75px",
                      borderRadius: "50%",
                    }}
                    className="me-3"
                  />

                  <div>
                    <h5>
                      {selectedApplicant.ownerDetails.firstName}{" "}
                      {selectedApplicant.ownerDetails.lastName}
                    </h5>
                    {selectedApplicant.ownerDetails.title && (
                      <p>{selectedApplicant.ownerDetails.title}</p>
                    )}
                    <Link
                      to={`/visitsProfile/${selectedApplicant.ownerDetails._id}`}
                    >
                      visit applicant
                    </Link>
                  </div>
                </div>
                <div>
                  {selectedApplicant.applicationStatus !== "selected" &&
                  selectedApplicant.applicationStatus !== "rejected" ? (
                    <Dropdown
                      optionLabel="name"
                      placeholder="change status"
                      className="w-full md:w-15rem"
                      onChange={(e) =>
                        handleChange(e.value.name, selectedApplicant._id)
                      }
                      options={changeStatus}
                    />
                  ) : null}
                  <p className="pt-2">
                    {selectedApplicant.applicationStatus !== "selected" &&
                    selectedApplicant.applicationStatus !== "rejected"
                      ? "Current Application Status: " +
                        selectedApplicant.applicationStatus
                      : `you have been ${selectedApplicant.applicationStatus}`}
                  </p>
                </div>
              </div>
              <div className="card mt-4">
                <div className="card-body">
                  <h5 style={{ fontWeight: "700" }}>Application Details</h5>
                  <hr />
                  {selectedApplicant.questionReply.map((question, index) => {
                    return (
                      <div className="mt-2">
                        <h6>{question.question}</h6>
                        <div
                          className="d-flex align-items-center badge badge-light p-3"
                          style={{
                            borderRadius: "10px",
                            color: "black",
                            fontWeight: "500",
                            width: "auto",
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                            lineHeight: "20px",
                          }}
                        >
                          {question.answer}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="mt-5"
                    style={{
                      width: "100%",
                      height: "500px",
                      objectFit: "cover",
                    }}
                  >
                    <embed
                      src={RESUME_PATH + selectedApplicant.resume}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">no applicants</p>
        )}
      </div>
    </>
  );
}

export default ApplicantView;
