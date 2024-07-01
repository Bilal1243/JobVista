import React, { useEffect, useState } from "react";
import "./ListApplicants.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar";

import {
  useRecruiterViewJobDetailsMutation,
  useRecruiterChangeStatusMutation,
  useRecruitergetResumeMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";
import SkeletonUi from "../../../components/Skeleton";

import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/recruiterComponents/ListApplicants/Sidebar";
import ApplicantView from "../../../components/recruiterComponents/ListApplicants/ApplicantView";

function ListApplicants() {
  const { jobId } = useParams();

  const [jobDetails, setJobDetails] = useState({});
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [status, setStatus] = useState();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const isMobile = window.innerWidth <= 767;

  const [recruiterViewJobDetails] = useRecruiterViewJobDetailsMutation();
  const [recruiterChangeStatus] = useRecruiterChangeStatusMutation();
  const [recruitergetResume] = useRecruitergetResumeMutation();

  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const responseData = await recruiterViewJobDetails({ jobId }).unwrap();
      setJobDetails(responseData.jobDetails);
      setApplications(responseData.applications);
      setFilteredApplications(responseData.applications);
      fetchResume(responseData.applications[0]);
      setIsLoading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e);
    if (e.length === 0) {
      fetchDetails();
    } else {
      const filteredApps = applications.filter((application) => {
        const fullName =
          `${application.ownerDetails.firstName} ${application.ownerDetails.lastName}`.toLowerCase();
        const email = application.ownerDetails.email.toLowerCase();
        const title = application.ownerDetails.title.toString().toLowerCase();
        const createdDate = new Date(application.createdAt)
          .toLocaleDateString()
          .toLowerCase();

        const searchTextLower = e.toLowerCase();

        return (
          fullName.includes(searchTextLower) ||
          email.includes(searchTextLower) ||
          title.includes(searchTextLower) ||
          createdDate.includes(searchTextLower)
        );
      });

      setFilteredApplications(filteredApps);
    }
  };

  const filterByDate = async (e) => {
    if (e === "All") {
      fetchDetails();
    } else {
      const sortedApps = applications.filter((application) => {
        return application.applicationStatus.toLowerCase() == e.toLowerCase();
      });

      if (sortedApps.length === 0) {
        setSelectedApplicant(null);
      } else {
        setSelectedApplicant(sortedApps[0]);
      }
      setFilteredApplications(sortedApps);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const applicationStatus = [
    { name: "All" },
    { name: "rejected" },
    { name: "Applied" },
    { name: "shortlisted" },
    { name: "Not shortlisted" },
    { name: "on interview process" },
    { name: "selected" },
  ];

  const changeStatus = [
    { name: "rejected" },
    { name: "shortlisted" },
    { name: "Not shortlisted" },
    { name: "on interview process" },
    { name: "selected" },
  ];

  const handleChange = async (e, applicationId) => {
    try {
      const response = await recruiterChangeStatus({
        status: e,
        applicationId,
      });
      fetchDetails();
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const fetchResume = async (application) => {
    try {
      const resumeData = await recruitergetResume({
        applicationId: application._id,
      }).unwrap();

      setSelectedApplicant(resumeData);
      setShowModal(true);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  return (
    <>
      <RecruiterNavbar></RecruiterNavbar>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container pt-4" style={{ marginTop: "90px" }}>
        <div className="row">
          <div className="col-md-12 mt-4 mt-sm-0 d-flex flex-column align-items-end justify-content-end p-2">
            <div className="d-flex mb-2">
              <div>
                <Button
                  label="Post Job"
                  severity="success"
                  raised
                  style={{ borderRadius: "10px" }}
                  onClick={() => navigate("/createJob")}
                />
              </div>
            </div>

            <div className="text-end me-2">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <SkeletonUi></SkeletonUi>
        ) : (
          <>
            <>
              <div className="row gutters-sm">
                <Sidebar
                  filteredApplications={filteredApplications}
                  fetchResume={fetchResume}
                  applicationStatus={applicationStatus}
                  filterByDate={filterByDate}
                  selectedApplicant={selectedApplicant}
                ></Sidebar>
                <div className="col-md-8">
                  <div className="card">
                    <ApplicantView
                      selectedApplicant={selectedApplicant}
                      changeStatus={changeStatus}
                      handleChange={handleChange}
                    ></ApplicantView>
                  </div>
                </div>
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
}

export default ListApplicants;
