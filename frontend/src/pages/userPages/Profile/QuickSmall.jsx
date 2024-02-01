import React from "react";
import { Link } from "react-router-dom";
import "primeicons/primeicons.css";
import "./Actions.css";

function QuickSmall({ handleTabChange, activeTab }) {
  return (
    <div className="card-header border-bottom mb-3 d-flex justify-content-center align-items-center d-md-none">
      <ul class="nav nav-tabs card-header-tabs" role="tablist">
        <li className="nav-item">
          <Link
            className={`nav-item nav-link has-icon nav-link-faded ${
              activeTab === "profile" ? "active" : ""
            } d-flex align-items-center`}
            onClick={() => handleTabChange("profile")}
          >
            <i
              className="pi pi-images"
              style={{ width: "15px", height: "15px" }}
            ></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-item nav-link has-icon ${
              activeTab === "personal-information" ? "active" : ""
            } d-flex align-items-center`}
            onClick={() => handleTabChange("personal-information")}
          >
            <i
              className="pi pi-user me-1"
              style={{ width: "15px", height: "15px" }}
            ></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-item nav-link has-icon nav-link-faded ${
              activeTab === "saved-posts" ? "active" : ""
            } d-flex align-items-center`}
            onClick={() => handleTabChange("saved-posts")}
          >
            <i
              className="pi pi-save"
              style={{ width: "15px", height: "15px" }}
            ></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-item nav-link has-icon nav-link-faded ${
              activeTab === "saved-jobs" ? "active" : ""
            } d-flex align-items-center`}
            onClick={() => handleTabChange("saved-jobs")}
          >
            <i
              className="pi pi-save"
              style={{ width: "15px", height: "15px" }}
            ></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-item nav-link has-icon nav-link-faded ${
              activeTab === "job-status" ? "active" : ""
            } d-flex align-items-center`}
            onClick={() => handleTabChange("job-status")}
          >
            <i
              className="pi pi-file"
              style={{ width: "15px", height: "15px" }}
            ></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-item nav-link has-icon nav-link-faded ${
              activeTab === "settings" ? "active" : ""
            } d-flex align-items-center`}
            onClick={() => handleTabChange("settings")}
          >
            <i
              className="pi pi-th-large"
              style={{ width: "15px", height: "15px" }}
            ></i>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default QuickSmall;
