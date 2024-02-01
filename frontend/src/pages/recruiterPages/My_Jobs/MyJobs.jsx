import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyJobs.css";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar";

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import {
  useRecruiterListJobsMutation,
  useRecruiterFilterLocationMutation,
  useRecruiterSearchJobMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";
import Loader from "../../../components/Loader";
import countrydata from "../../../Utils/Countries";

function MyJobs() {
  const navigate = useNavigate();

  const [myJobs, setMyjobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [recruiterListJobs] = useRecruiterListJobsMutation();
  const [recruiterSearchJob] = useRecruiterSearchJobMutation();
  const [recruiterFilterLocation] = useRecruiterFilterLocationMutation();

  useEffect(() => {
    fetchJobs();
    setCountryData([{ name: "all" }, ...countrydata]);
  }, []);

  const [selectedCity, setSelectedCity] = useState(null);

  const fetchJobs = async () => {
    const response = await recruiterListJobs({
      recruiterId: recruiterData._id,
    });
    setMyjobs(response.data.data);
    setIsLoading(false);
  };

  const handleChange = async (e) => {
    setSearchTerm(e.target.value);

    try {
      const responseSearch = await recruiterSearchJob({
        searchTerm: e.target.value, // Use e.target.value here
      }).unwrap();
      setMyjobs(responseSearch);
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  const filterLocation = async (e) => {
    setSelectedCity(e.target.value);
    try {
      if (e.target.value.name === "all") {
        fetchJobs();
      } else {
        const locationResult = await recruiterFilterLocation({
          location: e.target.value.name,
        }).unwrap();
        if (locationResult) {
          setMyjobs(locationResult);
        }
      }
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <>
      <RecruiterNavbar></RecruiterNavbar>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container pt-5">
        <div className="row">
          <div className="col-md-12 mt-4 mt-sm-0 d-flex flex-column align-items-end justify-content-end p-2">
            <div className="d-flex mb-2">
              <div>
                <Button
                  label="Post Job"
                  severity="success"
                  onClick={() => navigate("/createJob")}
                  raised
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="flex me-3">
                <Dropdown
                  optionLabel="name"
                  placeholder="Select a City"
                  className="w-full md:w-14rem"
                  value={selectedCity}
                  onChange={(e) => filterLocation(e)}
                  options={countryData}
                />
              </div>
            </div>

            <div className="text-end me-2">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleChange}
                />
              </span>
            </div>
          </div>
        </div>
        {myJobs?.length > 0 ? (
          <>
            {myJobs.map((job, index) => (
              <div className="col-lg-12 col-md-12 col-12 mt-4 pt-2" key={index}>
                <div className="card border-0 bg-light rounded shadow">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h5>{job.jobRole}</h5>
                      <div className="mt-3">
                        <span className="text-muted d-block">
                          <i className="fa fa-home" aria-hidden="true"></i>{" "}
                          <a href="#/" target="_blank" className="text-muted">
                            {job.company}
                          </a>
                        </span>
                        <span className="text-muted d-block">
                          <i
                            className="fa fa-map-marker"
                            aria-hidden="true"
                          ></i>{" "}
                          {job.location}
                        </span>
                        <span className="text-muted d-block">
                          Created Date:{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-3">
                        <Button
                          label="View Details"
                          severity="success"
                          className="me-3"
                          raised
                          style={{ borderRadius: "10px" }}
                          onClick={()=>navigate(`/viewApplications/${job._id}`)}
                        />
                      </div>
                    </div>
                    <div className="d-none d-md-flex align-items-center justify-content-end">
                      <div>
                        <span className="text-muted d-block">
                          Total Applicants: {job.applicationCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="text-center">
              <p>No Job Posts Yet</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default MyJobs;
