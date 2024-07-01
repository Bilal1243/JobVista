import React from "react";
import { Link } from "react-router-dom";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { PROFILE_PATH } from "../../../Utils/URL";
import defualtProfile from "../../../assets/defualtProfile.jpg";
import { Dropdown } from "primereact/dropdown";

function Sidebar({
  filteredApplications,
  fetchResume,
  applicationStatus,
  filterByDate,
  selectedApplicant,
}) {
  
  return (
    <>
      <div className="col-md-4 d-none d-md-block">
        <div className="card">
          <div className="card-body" style={{ maxHeight: "300px" }}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-3 ml-3">Applicants</h5>
              <Dropdown
                optionLabel="name"
                placeholder="Filter"
                className="w-full md:w-14rem"
                options={applicationStatus}
                onChange={(e) => filterByDate(e.value.name)}
              />
            </div>
            {filteredApplications.length > 0 ? (
              <nav
                className="nav flex-column nav-pills nav-gap-y-1"
                style={{ overflowY: "auto" }}
              >
                {[...filteredApplications].map((application, index) => {
                  return (
                    <Link
                      key={index}
                      className={`nav-item nav-link nav-link-faded ${
                        selectedApplicant?._id === application._id
                          ? "active"
                          : ""
                      } d-flex align-items-center`}
                      onClick={() => {
                        fetchResume(application);
                      }}
                    >
                      <img
                        src={
                          application.ownerDetails.profileImg
                            ? PROFILE_PATH + application.ownerDetails.profileImg
                            : defualtProfile
                        }
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        className="me-3"
                      />
                      {application.ownerDetails.firstName}{" "}
                      {application.ownerDetails.lastName}
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <p className="text-center">no applications</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
