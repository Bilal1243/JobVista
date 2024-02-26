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
  useRecruitereditJobMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";
import Loader from "../../../components/Loader";
import countrydata from "../../../Utils/Countries";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Chip } from "primereact/chip";
import { toast } from "react-toastify";
import { RadioButton } from "primereact/radiobutton";

function MyJobs() {
  const navigate = useNavigate();

  const [myJobs, setMyjobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState("top");

  const [selectedJob, setSelectedJob] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [openings, setOpenings] = useState();
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState("No");

  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [recruiterListJobs] = useRecruiterListJobsMutation();
  const [recruiterSearchJob] = useRecruiterSearchJobMutation();
  const [recruiterFilterLocation] = useRecruiterFilterLocationMutation();
  const [recruitereditJob] = useRecruitereditJobMutation();

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

  const handleJobClick = (id) => {
    const findJob = myJobs.filter((job) => {
      return job._id === id;
    });
    setSelectedJob(findJob[0]._id);
    setJobRole(findJob[0].jobRole);
    setOpenings(findJob[0].openings);
    setDescription(findJob[0].description);
    setShowModal(true);
  };

  const editJob = async (id) => {
    try {
      const responseData = await recruitereditJob({
        id: id,
        jobRole: jobRole,
        openings: openings,
        description: description,
        checked : checked
      }).unwrap();
      console.log(responseData);
      if (responseData.status) {
        toast.success("job post edited successfully");
        setShowModal(false);
      }
    } catch (error) {
      console.log(error?.data?.message || error?.data);
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
              <div
                className="col-lg-12 col-md-12 col-12 mt-4 pt-2"
                key={index}
                onClick={() => (job.recruited ? null : handleJobClick(job._id))}
                style={{ cursor: "pointer" }}
              >
                <div className="card border-0 bg-light rounded shadow">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <span className="d-flex align-items-center">
                        <h5 className="me-2">{job.jobRole}</h5>
                        {new Date(job.deadline) <= new Date() &&
                        job.recruited ? (
                          <Chip label="recruiting ended" />
                        ) : (
                          <Chip label="still recruiting" />
                        )}
                      </span>
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
                          onClick={() =>
                            navigate(`/viewApplications/${job._id}`)
                          }
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

      <Dialog
        header="edit job"
        visible={showModal}
        position={position}
        style={{ width: "50vw" }}
        onHide={() => setShowModal(false)}
        draggable={false}
        resizable={false}
      >
        <div className="card d-flex align-items-center justify-content-center p-3">
          <div className="row">
            <div className="col-lg-6">
              <InputText
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>
            <div className="col-lg-6">
              <InputNumber
                inputId="integeronly"
                value={openings}
                onValueChange={(e) => setOpenings(e.value)}
              />
            </div>
            <div className="col-lg-12 mt-3">
              <InputTextarea
                id="username"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                cols={30}
                style={{ border: "1px solid #b3b3b3" }}
              />
            </div>
            <div className="col-lg-12 mb-2 d-flex flex-column">
              do you want to end recruiting
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient1"
                  name="Yes"
                  value="Yes"
                  onChange={(e) => setChecked(e.value)}
                  checked={checked === "Yes"}
                />
                <label htmlFor="ingredient1" className="ml-2">
                  Yes
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="ingredient2"
                  name="No"
                  value="No"
                  onChange={(e) => setChecked(e.value)}
                  checked={checked === "No"}
                />
                <label htmlFor="ingredient2" className="ml-2">
                  No
                </label>
              </div>
            </div>
          </div>
          <Button
            label="submit"
            type="button"
            onClick={() => {
              editJob(selectedJob);
            }}
          ></Button>
        </div>
      </Dialog>
    </>
  );
}
export default MyJobs;
