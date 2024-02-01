import React from "react";
import { Link } from "react-router-dom";
import "./Profile.css";
import "primeicons/primeicons.css";

function QuickActions({ handleTabChange, activeTab }) {
  return (
    <div className="col-md-4 d-none d-md-block">
      <div className="card">
        <div className="card-body">
          <h5 className="mb-3 ml-3">Quick Actions</h5>
          <nav className="nav flex-column nav-pills nav-gap-y-1">
            <Link
              className={`nav-item nav-link has-icon ${
                activeTab === "profile" ? "active" : ""
              } d-flex align-items-center`}
              onClick={() => handleTabChange("profile")}
            >
              <i className="pi pi-images me-1"></i>Posts
            </Link>
            <Link
              className={`nav-item nav-link has-icon ${
                activeTab === "saved-posts" ? "active" : ""
              } d-flex align-items-center`}
              onClick={() => handleTabChange("saved-posts")}
            >
              <i className="pi pi-save me-1"></i>
              Saved Posts
            </Link>
            <Link
              className={`nav-item nav-link has-icon ${
                activeTab === "settings" ? "active" : ""
              } d-flex align-items-center`}
              onClick={() => handleTabChange("settings")}
            >
              <i className="pi pi-th-large me-1"></i>
              Account Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
