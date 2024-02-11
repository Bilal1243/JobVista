import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import "primeicons/primeicons.css";
import jobVistaLogo from "../../assets/jobVista.png";
import defualtProfile from "../../assets/defualtProfile.jpg";
import { PROFILE_PATH } from "../../Utils/URL";

import "./Navbar.css";

import { useUserRequestCountMutation } from "../../redux/userSlices/userApiSlice";

function NavbarUi() {
  const { userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [userRequestCount] = useUserRequestCountMutation();
  const [requests, setRequests] = useState(0);

  const fetchRequests = async () => {
    try {
      const response = await userRequestCount({
        userId: userData._id,
      }).unwrap();
      setRequests(response.length);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    if (userData !== null) {
      fetchRequests();
    }
  }, []);

  const items = [
    {
      label: (
        <Button
          label="Home"
          icon="pi pi-fw pi-home"
          onClick={() => navigate("/")}
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
          label="Jobs"
          icon="pi pi-fw pi-briefcase"
          onClick={() => navigate("/Jobs")}
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
          onClick={() => navigate("/MyNetwork")}
          badge={requests !== 0 ? requests : null}
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
          onClick={() => navigate("/Jobs")}
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
              src={
                userData && userData.image
                  ? PROFILE_PATH + userData.image
                  : defualtProfile
              }
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            ></img>
          }
          onClick={() => navigate("/profile")}
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
          label="Login"
          icon="pi pi-fw pi-sign-in"
          onClick={() => navigate("/login")}
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
          onClick={() => navigate("/signup")}
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
    <Link to={"/"}>
      <div style={navbarContainerStyle}>
        <img alt="logo" src={jobVistaLogo} height="50" className="mr-2"></img>
      </div>
    </Link>
  );
  const menubarStyle = {
    backgroundColor: "white", // Specify your desired background color here
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const Navbar = userData !== null ? items : beforelogin;

  return (
    <div className="container-fluid navbar-container">
      {userData !== null ? (
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

export default NavbarUi;
