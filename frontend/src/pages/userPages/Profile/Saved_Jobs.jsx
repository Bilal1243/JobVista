import React, { useEffect, useState } from "react";
import "./Profile.css";
import "./Actions.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";

import Loader from "../../../components/Loader.jsx";
import {
  useListSavedJobsMutation,
  useUnsaveJobsMutation,
} from "../../../redux/userSlices/userApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SavedJobs({ activeTab }) {
  const { userData } = useSelector((state) => state.auth);

  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [listSavedJobs] = useListSavedJobsMutation();
  const [unsaveJobs] = useUnsaveJobsMutation();

  const navigate = useNavigate();

  const fetchSavedJobs = async () => {
    try {
      const response = await listSavedJobs().unwrap();
      setSavedItems(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const unsaveJob = async (jobId) => {
    try {
      const responseData = await unsaveJobs({
        userId: userData._id,
        jobId: jobId,
      }).unwrap();
      fetchSavedJobs();
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  const reversedItems =
    savedItems && savedItems.length > 0 ? [...savedItems].reverse() : null;

  return (
    <div
      className={`tab-pane ${activeTab === "saved-jobs" ? "active" : ""}`}
      id="saved-posts"
    >
      {reversedItems !== null ? (
        <>
          {reversedItems.map((item, index) => {
            return (
              <div className="col-md-12" key={index}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>{item.jobDetails[0].jobRole}</h5>
                      <Button
                        icon="pi pi-bookmark-fill"
                        rounded
                        outlined
                        text 
                        raised
                        severity="secondary"
                        aria-label="Bookmark"
                        style={{borderRadius:'50%'}}
                        onClick={() => unsaveJob(item.jobDetails[0]._id)}
                      />
                      {/* <i
                        className="pi pi-bookmark-fill"
                        style={{ cursor: "pointer" }}
                        onClick={() => unsaveJob(item.jobDetails[0]._id)}
                      ></i> */}
                    </div>
                    <p>{item.jobDetails[0].company}</p>
                    <p>applicants : {item.jobDetails[0].applicationCount}</p>
                    <p>
                      experience required :{" "}
                      {item.jobDetails[0].experience.minimum} -{" "}
                      {item.jobDetails[0].experience.maximum} years
                    </p>
                    {item.isApplied ? (
                      <div
                        className="badge"
                        style={{ backgroundColor: "black", padding: "10px" }}
                      >
                        already applied
                      </div>
                    ) : (
                      <Button
                        style={{ borderRadius: "10px" }}
                        onClick={() =>
                          navigate(`/applyJob/${item.jobDetails[0]._id}`)
                        }
                      >
                        Apply Job
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <p className="text-center">No Saved Jobs</p>
      )}
    </div>
  );
}

export default SavedJobs;
