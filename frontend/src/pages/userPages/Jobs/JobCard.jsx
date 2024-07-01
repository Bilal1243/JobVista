import React from "react";

import { useNavigate } from "react-router-dom";

import { TbBulbFilled } from "react-icons/tb";
import { FaBookOpen, FaSuitcase } from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { IoLocationSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";

import TimeAgo from "../../../Utils/TimeAgo";

import "bootstrap/dist/css/bootstrap.min.css";
import "./JobListing.css";

function JobCard({ job, handleJobClick }) {
  const navigate = useNavigate();

  const isMobileDevice = window.innerWidth <= 767;

  return (
    <>
      {isMobileDevice ? (
        <div className="card mb-3" style={{ cursor: "pointer" }} onClick={() => navigate(`/viewJob/${job._id}`)}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4
                className="card-title"
              >
                {job.jobRole}
              </h4>
            </div>
            <h6
              className="text-muted"
            >
              {job.company}
            </h6>
            <div
              className="d-flex align-items-center mb-2"
              style={{ fontWeight: "400", fontSize: "15px" }}
            >
              <MdManageAccounts className="me-1 text-muted" />
              {job.experience.minimum}
              &nbsp;-&nbsp;
              {job.experience.maximum} years
            </div>
            <div
              className="d-flex align-items-center mb-2"
              style={{ fontWeight: "400", fontSize: "15px" }}
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(parseInt(job.salaryRange.minimum))}
              &nbsp;-&nbsp;
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(parseInt(job.salaryRange.minimum))}{" "}
              per year
            </div>
            <p className="card-text">
              <TimeAgo createdAt={job.createdAt}></TimeAgo>
            </p>
          </div>
        </div>
      ) : (
        <div className="card mb-3" style={{ cursor: "pointer" }} onClick={() => handleJobClick(job)}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="card-title">
                {job.jobRole}
              </h4>
              {/* {job.isSaved ? (
                <i
                  className="pi pi-bookmark-fill"
                  style={{ cursor: "pointer" }}
                  onClick={() => unsaveJob(job._id)}
                ></i>
              ) : (
                <i
                  className="pi pi-bookmark"
                  style={{ cursor: "pointer" }}
                  onClick={() => saveJob(job._id)}
                ></i>
              )} */}
            </div>
            <h6 className="text-muted">
              {job.company}
            </h6>
            <div
              className="d-flex align-items-center mb-2"
              style={{ fontWeight: "400", fontSize: "15px" }}
            >
              <MdManageAccounts className="me-1 text-muted" />
              {job.experience.minimum}
              &nbsp;-&nbsp;
              {job.experience.maximum} years
            </div>
            <div
              className="d-flex align-items-center mb-2"
              style={{ fontWeight: "400", fontSize: "15px" }}
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(parseInt(job.salaryRange.minimum))}
              &nbsp;-&nbsp;
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(parseInt(job.salaryRange.maximum))}{" "}
            {job.rate}
            </div>
            <p className="card-text">
              <TimeAgo createdAt={job.createdAt}></TimeAgo>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default JobCard;
