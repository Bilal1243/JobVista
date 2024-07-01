import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./JobListing.css";
import NavbarUi from "../../../components/Navbars/Navbar";
import { useSelector, useDispatch } from "react-redux";

import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import {
  useListJobsMutation,
  useSaveJobsMutation,
  useUnsaveJobsMutation,
  useUserLogoutMutation,
  useUserSearchJobMutation,
} from "../../../redux/userSlices/userApiSlice";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";

import SkeletonUi from "../../../components/Skeleton";
import TimeAgo from "../../../Utils/TimeAgo";
import handleBlockedUser from "../../../Utils/handleBlockedUsers.js";

import { TbBulbFilled } from "react-icons/tb";
import { FaBookOpen, FaSuitcase } from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { IoLocationSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { CgArrowsExpandLeft, CgFileDocument } from "react-icons/cg";

import SearchBar from "./SearchBar.jsx";
import JobCard from "./JobCard.jsx";

function JobListing() {
  const { userData } = useSelector((state) => state.auth);

  const [jobs, setJobs] = useState([]);
  const [searchTags, setSearchTags] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSkeleton, setIsSkeleton] = useState(true);

  const dispatch = useDispatch();

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const indexOfLastJob = (currentPage + 1) * rows;
  const indexOfFirstJob = currentPage * rows;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const [listJobs] = useListJobsMutation();
  const [saveJobs] = useSaveJobsMutation();
  const [unsaveJobs] = useUnsaveJobsMutation();

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const response = await listJobs();
      await handleBlockedUser(response, dispatch);
      setJobs(response.data);
      setTimeout(() => {
        setIsSkeleton(false);
      }, 1000);
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  const saveJob = async (jobId) => {
    try {
      const responseData = await saveJobs({
        userId: userData._id,
        jobId: jobId,
      }).unwrap();

      await handleBlockedUser(responseData, dispatch);

      // Update the jobs state while preserving the order
      setJobs((prevJobs) => {
        const updatedJobs = prevJobs.map((job) => {
          return job._id === jobId ? { ...job, isSaved: true } : job;
        });
        return updatedJobs;
      });

      // Update selectedJob if the saved job is the currently selected job
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob((prevSelectedJob) => ({
          ...prevSelectedJob,
          isSaved: true,
        }));
      }
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      const responseData = await unsaveJobs({
        userId: userData._id,
        jobId: jobId,
      }).unwrap();

      await handleBlockedUser(responseData, dispatch);

      // Update the jobs state while preserving the order
      setJobs((prevJobs) => {
        const updatedJobs = prevJobs.map((job) => {
          return job._id === jobId ? { ...job, isSaved: false } : job;
        });
        return updatedJobs;
      });

      // Update selectedJob if the unsaved job is the currently selected job
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob((prevSelectedJob) => ({
          ...prevSelectedJob,
          isSaved: false,
        }));
      }
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  const handleSearch = (searchQuery, locationQuery) => {
    try {
      const searchTextLower =
        searchQuery.length > 0 ? searchQuery.toLowerCase() : null;
      const searchTextTwoLower =
        locationQuery.length > 0 ? locationQuery.toLowerCase() : null;

      if (searchTextLower === null && searchTextTwoLower === null) {
        return fetchJobs();
      }

      const filteredJobs = currentJobs.filter((job) => {
        const jobRole = job.jobRole.toLowerCase();
        const location = job.location.toLowerCase();
        const company = job.company.toLowerCase();
        const createdDate = new Date(job.createdAt)
          .toLocaleDateString()
          .toLowerCase();

        return (
          jobRole.includes(searchTextLower) ||
          location.includes(searchTextTwoLower) ||
          company.includes(searchTextLower) ||
          createdDate.includes(searchTextLower)
        );
      });

      setJobs(filteredJobs);
      setSelectedJob(filteredJobs[0]);
    } catch (error) {
      console.error("Error updating jobs:", error);
    }
  };

  const handleJobClick = (job) => {
    // Set the selected job to the state
    setSelectedJob(job);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Set selectedJob to jobs[0] only if it is not already set
    if (!selectedJob && jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [selectedJob, jobs]);

  return (
    <>
      <NavbarUi />
      <SearchBar jobs={jobs} onSearch={handleSearch} />
      <div className="container mt-4">
        {jobs.length > 0 && selectedJob !== undefined ? (
          <div className="row gutters-sm">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body" style={{ overflowY: "auto" }}>
                  {isSkeleton ? (
                    <SkeletonUi />
                  ) : (
                    <>
                      {searchTags.length > 0 ? (
                        <p className="text-muted">
                          jobs based on {searchTags[0]},
                          {searchTags[1] && searchTags[1]}
                        </p>
                      ) : (
                        <p className="text-muted">jobs based on your profile</p>
                      )}

                      <hr />
                      {currentJobs.map((job, index) => (
                        <JobCard
                          job={job}
                          handleJobClick={handleJobClick}
                          saveJob={saveJob}
                          unsaveJob={unsaveJob}
                          key={job._id}
                        ></JobCard>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="card">
                <Paginator
                  first={first}
                  rows={rows}
                  totalRecords={jobs.length}
                  onPageChange={(e) => {
                    setFirst(e.first);
                    setCurrentPage(e.first / rows);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block mb-3">
              <div className="card">
                <div className="card-body">
                  {!isSkeleton ? (
                    <>
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title mb-2">
                            {selectedJob?.jobRole}
                          </h4>
                          <div className="d-flex flex-column">
                            <p className="text-muted mb-2">
                              {selectedJob?.company}
                            </p>
                            <div className="d-flex align-items-center mb-2">
                              <i className="pi pi-map-marker"></i>
                              <span className="ms-2">
                                {selectedJob?.location}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <CgFileDocument></CgFileDocument>
                            <span className="ms-2">
                              Applicants: {selectedJob?.applicationCount}
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            posted:
                            <TimeAgo
                              createdAt={selectedJob?.createdAt}
                            ></TimeAgo>
                          </div>
                          <div className="d-flex align-items-center mt-2">
                            <Button
                              label="Apply Now"
                              severity="primary"
                              style={{ borderRadius: "10px" }}
                              onClick={() =>
                                navigate(`/applyJob/${selectedJob?._id}`)
                              }
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
                              {selectedJob?.isSaved ? (
                                <i
                                  className="pi pi-bookmark-fill"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => unsaveJob(selectedJob?._id)}
                                ></i>
                              ) : (
                                <i
                                  className="pi pi-bookmark"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => saveJob(selectedJob?._id)}
                                ></i>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card mt-3"
                        style={{
                          height: "350px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <div className="card-body">
                          <h5 style={{ fontWeight: "700" }}>
                            Profile Insights
                          </h5>
                          <p className="mb-5" style={{ fontSize: "12px" }}>
                            Here's how the job qualifications align with your
                            profile.
                          </p>
                          <div
                            className="d-flex align-items-center"
                            style={{ fontWeight: "600" }}
                          >
                            <TbBulbFilled className="me-2 text-muted" />
                            Skills
                          </div>
                          <div className="d-flex flex-wrap">
                            {selectedJob.skills.map((skill, index) => (
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
                            }).format(
                              parseInt(selectedJob.salaryRange.minimum)
                            )}
                            &nbsp;-&nbsp;
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(
                              parseInt(selectedJob.salaryRange.maximum)
                            )}{" "}
                            per year
                          </div>

                          <div
                            className="d-flex align-items-center mt-3"
                            style={{ fontWeight: "600" }}
                          >
                            <FaSuitcase className="me-2 text-muted" />
                            job type
                          </div>
                          {selectedJob.jobType.map((jobType, index) => (
                            <div
                              className="d-flex align-items-center badge badge-light p-3"
                              style={{
                                borderRadius: "10px",
                                color: "black",
                                fontWeight: "500",
                                width: "200px",
                              }}
                              key={index}
                            >
                              {jobType}
                            </div>
                          ))}
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
                          {selectedJob.email !== null &&
                          selectedJob.mobile !== null ? (
                            <>
                              <h5 style={{ fontWeight: "700" }}>
                                Recruiter Details
                              </h5>
                              <div
                                className="d-flex align-items-center mt-3"
                                style={{ fontWeight: "500" }}
                              >
                                {selectedJob.email} , {selectedJob.mobile}
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
                              whiteSpace: "pre-line",
                              wordWrap: "break-word",
                              lineHeight: "20px",
                            }}
                          >
                            {selectedJob.description}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <SkeletonUi />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">no jobs</p>
        )}
      </div>
    </>
  );
}
export default JobListing;
