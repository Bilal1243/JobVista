import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Badge } from 'primereact/badge';

import "primeicons/primeicons.css";
import jobVistaLogo from "../../../assets/JobVista.png";

import "./RecruiterNavbar.css";
import { PROFILE_PATH } from "../../../Utils/URL";
import { useRecruiterRequestCountMutation } from "../../../redux/recruiterSlices/recruiterApiSlices";

function RecruiterNavbar() {
  const { recruiterData } = useSelector((state) => state.recruiterAuth);
  const [recruiterRequestCount] = useRecruiterRequestCountMutation();
  const [requests, setRequests] = useState(0);

  const fetchRequests = async () => {
    try {
      const response = await recruiterRequestCount({
        userId: recruiterData._id,
      }).unwrap();

      setRequests(response.length);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (recruiterData !== null) {
      fetchRequests();
    }
  }, []);

  const navigate = useNavigate();
  const items = [
    {
      label: (
        <Button
          label="Home"
          icon="pi pi-fw pi-home"
          onClick={() => navigate("/recruiter")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "1px",
          }}
        />
      ),
    },
    {
      label: (
        <Button
          label="My Jobs"
          icon="pi pi-fw pi-briefcase"
          onClick={() => navigate("/myJobs")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "1px",
          }}
        />
      ),
    },
    {
      label: (
        <Button
          label="My Network"
          icon="pi pi-fw pi-users"
          badge={requests !== 0 ? requests : null}
          onClick={() => navigate("/Recruiter-Network")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "1px",
          }}
          className="navbar-button"
        />
      ),
    },
    {
      label: (
        <Button
          label="Messaging"
          icon="pi pi-fw pi-comments"
          onClick={() => navigate("/Recruiter-Messages")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "1px",
          }}
        />
      ),
    },
    {
      label: (
        <Button
          icon={
            <img
              src={PROFILE_PATH + recruiterData.image}
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            ></img>
          }
          onClick={() => navigate("/Recruiter-Profile")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "40px",
          }}
        />
      ),
    },
  ];

  const beforelogin = [
    {
      label: (
        <Button
          label="Home"
          icon="pi pi-fw pi-home"
          onClick={() => navigate("/recruiter")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "1px",
          }}
        />
      ),
    },
    {
      label: (
        <Button
          label="Login"
          icon="pi pi-fw pi-sign-in"
          onClick={() => navigate("/recruiterLogin")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "1px",
          }}
        />
      ),
    },
    {
      label: (
        <Button
          label="Signup"
          icon="pi pi-fw pi-user-plus"
          onClick={() => navigate("/recruiterRegister")}
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "none",
            backgroundColor: "transparent",
            height: "1px",
          }}
        />
      ),
    },
  ];

  const navbarContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const start = (
    <Link to={"/recruiter"}>
      <div style={navbarContainerStyle}>
        <img alt="logo" src={jobVistaLogo} height="50" className="mr-2"></img>
      </div>
    </Link>
  );
  const menubarStyle = {
    backgroundColor: "white", // Specify your desired background color here
    justifyContent: "space-between",
    alignItems: "center",
  };

  const Navbar = recruiterData !== null ? items : beforelogin;

  return (
    <div className=" navbar-container">
      {recruiterData !== null ? (
        <Menubar
          model={Navbar}
          start={start}
          style={menubarStyle}
          className="menubar"
        />
      ) : (
        <Menubar
          model={Navbar}
          start={start}
          style={menubarStyle}
          className="menubar"
        />
      )}
    </div>
  );
}

export default RecruiterNavbar;
