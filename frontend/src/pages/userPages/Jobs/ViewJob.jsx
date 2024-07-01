import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./JobListing.css";
import { useParams, useNavigate } from "react-router-dom";

import {
  useUserViewJobMutation,
  useSaveJobsMutation,
  useUnsaveJobsMutation,
} from "../../../redux/userSlices/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import NavbarUi from "../../../components/Navbars/Navbar";

import { TbBulbFilled } from "react-icons/tb";
import { FaBookOpen, FaSuitcase } from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { IoLocationSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";

import SkeletonUi from "../../../components/Skeleton";

import TimeAgo from "../../../Utils/TimeAgo";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import handleBlockedUser from "../../../Utils/handleBlockedUsers.js";

function ViewJob() {
  const { userData } = useSelector((state) => state.auth);
  const [selectedJob, setSelectedJob] = useState({});
  const { jobId } = useParams();

  const [UserViewJob] = useUserViewJobMutation();
  const [saveJobs] = useSaveJobsMutation();
  const [unsaveJobs] = useUnsaveJobsMutation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchJob = async () => {
    try {
      const responseData = await UserViewJob({ userId: userData._id, jobId });
      setSelectedJob(responseData.data);
    } catch (error) {
      setError(error?.message || error?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      let responseData;

      if (!selectedJob.isSaved) {
        responseData = await saveJobs({
          userId: userData._id,
          jobId: selectedJob._id,
        }).unwrap();
      } else {
        responseData = await unsaveJobs({
          userId: userData._id,
          jobId: selectedJob._id,
        }).unwrap();
      }
      await handleBlockedUser(responseData, dispatch);

      // Refetch the job details after saving/unsaving
      fetchJob();
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchJob();

    // Redirect to "/jobs" for larger devices
    const isMobileDevice = window.innerWidth <= 767;
    if (!isMobileDevice) {
      navigate("/jobs");
    }
  }, [jobId, userData._id]);

  if (loading) {
    return <SkeletonUi></SkeletonUi>;
  }

  return (
    <>
      <NavbarUi></NavbarUi>
      <div className="container" style={{ marginTop: "150px" }}>
        <div className="col-md-12">
          <div className="card p-3">
            <div className="card-body">
              <h4 className="card-title mb-2">{selectedJob.jobRole}</h4>
              <div className="d-flex flex-column">
                <p className="text-muted mb-2">{selectedJob.company}</p>
                <div className="d-flex align-items-center mb-2">
                  <i className="pi pi-map-marker"></i>
                  <span className="ms-2">{selectedJob.location}</span>
                </div>
              </div>
              <div className="d-flex align-items-center mb-2">
                <CgFileDocument></CgFileDocument>
                <span className="ms-2">
                  Applicants: {selectedJob.applicationCount}
                </span>
              </div>
              <div className="d-flex align-items-center mb-3">
                posted:
                <TimeAgo createdAt={selectedJob.createdAt}></TimeAgo>
              </div>
              <div className="d-flex align-items-center mt-2">
                <Button
                  label="Apply Now"
                  severity="primary"
                  style={{ borderRadius: "10px" }}
                  onClick={() => navigate(`/applyJob/${selectedJob._id}`)}
                ></Button>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "75px",
                    marginLeft: "10px",
                    border: "none",
                    backgroundColor: "#f0f0f0",
                    padding: "14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  {selectedJob.isSaved ? (
                    <i
                      className="pi pi-bookmark-fill"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSaveJob()}
                    ></i>
                  ) : (
                    <i
                      className="pi pi-bookmark"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSaveJob()}
                    ></i>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <h5 style={{ fontWeight: "700" }}>Profile Insights</h5>
              <p className="mb-5" style={{ fontSize: "12px" }}>
                Here's how the job qualifications align with your profile.
              </p>
              <div
                className="d-flex align-items-center"
                style={{ fontWeight: "600" }}
              >
                <TbBulbFilled className="me-2 text-muted" />
                Skills
              </div>
              <div className="d-flex flex-wrap">
                {selectedJob?.skills?.map((skill, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center badge badge-light m-1 p-3"
                    style={{
                      borderRadius: "12px",
                      color: "black",
                      fontWeight: "400",
                    }}
                  >
                    <i className="pi pi-star me-1"></i>
                    {`${skill.skill}`}
                  </div>
                ))}
              </div>
              <div
                className="d-flex align-items-center mt-3"
                style={{ fontWeight: "600" }}
              >
                <FaBookOpen className="me-2 text-muted" />
                Education
              </div>
              <div
                className="d-flex align-items-center badge badge-light p-3"
                style={{
                  borderRadius: "10px",
                  color: "black",
                  width: "200px",
                  fontWeight: "500",
                }}
              >
                {selectedJob.qualification}
              </div>
              <hr />

              <h5 style={{ fontWeight: "700" }}>Job details</h5>
              <p className="mb-5" style={{ fontSize: "12px" }}>
                Here's how the job details align with your profile.
              </p>
              <div
                className="d-flex align-items-center mt-3"
                style={{ fontWeight: "600" }}
              >
                <LiaMoneyBillWaveSolid className="me-2 text-muted" />
                Pay
              </div>
              <div
                className="d-flex align-items-center badge badge-light p-3"
                style={{
                  borderRadius: "10px",
                  color: "black",
                  width: "300px",
                  fontWeight: "500",
                }}
              >
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(parseInt(selectedJob.salaryRange.minimum))}
                &nbsp;-&nbsp;
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(parseInt(selectedJob.salaryRange.maximum))}{" "}
                per year
              </div>

              <div
                className="d-flex align-items-center mt-3"
                style={{ fontWeight: "600" }}
              >
                <FaSuitcase className="me-2 text-muted" />
                job type
              </div>
              <div
                className="d-flex align-items-center badge badge-light p-3"
                style={{
                  borderRadius: "10px",
                  color: "black",
                  fontWeight: "500",
                  width: "200px",
                }}
              >
                {selectedJob.jobType}
              </div>
              <div
                className="d-flex align-items-center mt-3"
                style={{ fontWeight: "600" }}
              >
                <MdManageAccounts className="me-2 text-muted" />
                Experience
              </div>
              <div
                className="d-flex align-items-center badge badge-light p-3"
                style={{
                  borderRadius: "10px",
                  color: "black",
                  fontWeight: "500",
                  width: "200px",
                }}
              >
                {selectedJob.experience.minimum}
                &nbsp;-&nbsp;
                {selectedJob.experience.maximum} years
              </div>
              <hr />
              <h5 style={{ fontWeight: "700" }}>Location</h5>
              <div
                className="d-flex align-items-center mt-3"
                style={{ fontWeight: "500" }}
              >
                <IoLocationSharp className="me-2 text-muted" />
                {selectedJob.location}
              </div>
              <hr />
              {selectedJob.email !== null && selectedJob.mobile !== null ? (
                <>
                  <h5 style={{ fontWeight: "700" }}>Recruiter Details</h5>
                  <div
                    className="d-flex align-items-center mt-3"
                    style={{ fontWeight: "500" }}
                  >
                    <IoLocationSharp className="me-2 text-muted" />
                    {selectedJob.location}
                  </div>
                  <hr />
                </>
              ) : null}
              <h5 style={{ fontWeight: "700" }}>Job Description</h5>
              <div
                className="d-flex align-items-center badge badge-light p-3"
                style={{
                  borderRadius: "10px",
                  color: "black",
                  fontWeight: "500",
                  width: "auto",
                }}
              >
                {selectedJob.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewJob;
