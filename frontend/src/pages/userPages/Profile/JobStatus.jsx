import React, { useEffect, useState } from "react";
import { useUserlistJobStatusMutation } from "../../../redux/userSlices/userApiSlice";
import Loader from "../../../components/Loader";
import TimeAgo from "../../../Utils/TimeAgo";

import "primeicons/primeicons.css";

function JobStatus({ activeTab }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [userlistJobStatus] = useUserlistJobStatusMutation();

  const fetchJobStatus = async () => {
    try {
      const response = await userlistJobStatus().unwrap();
      setJobs(response);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchJobStatus();
  }, []);

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <div
      className={`tab-pane ${activeTab === "job-status" ? "active" : ""}`}
      id="saved-posts"
    >
      {jobs.length > 0 ? (
        <div className="col-md-12">
          {[...jobs].reverse().map((job, index) => {
            return (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>{job.jobDetails[0].jobRole}</h5>
                  </div>
                  <p>{job.jobDetails[0].company}</p>
                  <p>Total Applicants : {job.jobDetails[0].applicationCount}</p>
                  <div
                    className="badge"
                    style={{ backgroundColor: "#3dd966", padding: "10px" }}
                  >
                    <i className="pi pi-check"></i> {job.applicationStatus}{" "}
                    <TimeAgo createdAt={job.updatedAt}></TimeAgo>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center">You are not applied for any jobs yet !!</p>
      )}
    </div>
  );
}

export default JobStatus;
