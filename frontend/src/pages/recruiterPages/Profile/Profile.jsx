import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar.jsx";
import "./Profile.css";
import defualtProfile from "../../../assets/defualtProfile.jpg";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

import {
  useRecruiterMyProfileMutation,
  useRecruitereditProfileMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices.js";
import Loader from "../../../components/Loader.jsx";
import { useSelector } from "react-redux";
import {
  MDBInput,
  MDBValidation,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";
import {toast} from 'react-toastify'

import Posts from "./Posts.jsx";
import QuickActions from "./QuickActions.jsx";
import QuickSmall from "./QuickSmall.jsx";

import countrydata from "../../../Utils/Countries.js";

import { useDispatch } from "react-redux";
import { setCredentials } from "../../../redux/recruiterSlices/recruiterAuthSlice.js";
import { PROFILE_PATH } from "../../../Utils/URL.js";
import SavedPosts from "./SavedPosts.jsx";
import Settings from "./Settings.jsx";

function RecruiterProfile() {
  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [profileData, setProfileData] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [isLoading, setIsloading] = useState(true);

  const [showContact, setShowContact] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [countries, setCountries] = useState([]);

  const [location, setLocation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [company, setCompany] = useState("");

  const [activeTab, setActiveTab] = useState("profile");

  const [recruiterMyProfile] = useRecruiterMyProfileMutation();
  const [recruitereditProfile] = useRecruitereditProfileMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchProfileData();
    setCountries(countrydata);
  }, []);

  const fetchProfileData = async () => {
    try {
      const responseData = await recruiterMyProfile({
        recruiterId: recruiterData._id,
      }).unwrap();
      setProfileData(responseData.data);
      if (responseData.followers.length === 0) {
        setFollowers(0);
      } else {
        setFollowers(responseData.followers[0].followersList.length);
      }
      setLocation(responseData.data.location);
      setFirstName(responseData.data.firstName);
      setLastName(responseData.data.lastName);
      setTitle(responseData.data.title);
      setCompany(responseData.data.companyName);
      setProfileImg(responseData.data.profileImg);
      setIsloading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.data || error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  const editProfileHandler = async () => {
    try {
      if (firstName.trim().length === 0 || firstName.length < 3) {
        toast.error("add firstName");
      } else if (lastName.trim().length === 0) {
        toast.error("add proper lastName");
      } else if (company.trim().length === 0) {
        toast.error("add proper company Name");
      } else {
      const formData = new FormData();
      formData.append("recruiterId", profileData._id);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("companyName", company);
      if (title) {
        formData.append("title", title);
      }

      if (location?.name !== undefined) {
        formData.append("location", location?.name);
      }
      formData.append("profileImg", profileImg);

      const response = await recruitereditProfile(formData).unwrap();
      if (response.status) {
        dispatch(setCredentials(response.data));
        setShowEdit(false);
        fetchProfileData();
      }
    }
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  const isMobile = window.innerWidth <= 767;

  return (
    <>
      <RecruiterNavbar />
      <div
        className="container flex-grow-1 container-p-y"
        style={{ marginTop: "150px" }}
      >
        <div className="container theme-bg-white mb-4">
          <div className="media col-12 col-md-10 col-lg-8 col-xl-7 py-5 d-flex pl-5">
            <div className="d-block">
              <img
                src={
                  profileData.profileImg
                    ? PROFILE_PATH + profileData.profileImg
                    : defualtProfile
                }
                alt=""
                className="ui-w-100 rounded-circle"
              />
              <Link className="d-flex align-items-center justify-content-center mt-2">
                <i
                  className="pi pi-user-edit"
                  style={{
                    fontSize: "20px",
                    marginLeft: "10px",
                    color: "black",
                  }}
                  onClick={() => setShowEdit(true)}
                ></i>
              </Link>
            </div>
            <div className="media-body ml-3">
              <h4 className="font-weight-bold mb-2">{profileData.userName}</h4>
              <>
                {profileData.title ? (
                  <h5 className="font-weight-bold mb-1 text-muted">
                    {profileData.title}
                  </h5>
                ) : (
                  <div
                    className="d-flex align-items-center mb-2 mt-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("settings")}
                  >
                    <div className="text-muted">add details</div>
                  </div>
                )}
                {profileData.location ? (
                  <div className="d-flex align-items-center mb-2 mt-2">
                    <div className="text-muted">{profileData.location}</div>
                  </div>
                ) : (
                  <div
                    className="d-flex align-items-center mb-2 mt-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("settings")}
                  >
                    <div className="text-muted">add details</div>
                  </div>
                )}
              </>
              <div>
                <Link onClick={() => setShowContact(true)}>Contact Info</Link>
              </div>
              <div>
                <Link to="/recruiter-connections">{followers} Connections</Link>
              </div>
            </div>
          </div>
          <hr className="m-0" />
        </div>
        <Dialog
          header={profileData.userName}
          visible={showContact}
          style={isMobile ? { width: "90%" } : { width: "50%" }}
          onHide={() => setShowContact(false)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ flex: 1, maxWidth: "450px", margin: "0 15px" }}>
              <MDBValidation noValidate className="row g-3">
                <div className="col-md-12">
                  <MDBInput value={profileData.email} readOnly />
                </div>
                <div className="col-md-12">
                  <MDBInput value={profileData.mobile} readOnly />
                </div>
              </MDBValidation>
            </div>
          </div>
        </Dialog>
        <div className="row gutters-sm">
          <QuickActions
            handleTabChange={handleTabChange}
            activeTab={activeTab}
          ></QuickActions>
          <div className="col-md-8">
            <div className="card">
              <QuickSmall
                handleTabChange={handleTabChange}
                activeTab={activeTab}
              ></QuickSmall>
              <div className="card-body tab-content">
                {activeTab === "profile" && (
                  <Posts activeTab={activeTab}></Posts>
                )}
                {activeTab === "saved-posts" && (
                  <SavedPosts activeTab={activeTab}></SavedPosts>
                )}
                {activeTab === "settings" && (
                  <Settings activeTab={activeTab}></Settings>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        header={"edit intro"}
        visible={showEdit}
        onHide={() => setShowEdit(false)}
        style={isMobile ? { width: "90%" } : { width: "50%" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, maxWidth: "100%", margin: "0 15px" }}>
            <MDBCard alignment="center" className="mb-5">
              <MDBCardBody>
                <MDBValidation
                  noValidate
                  className="row g-3"
                  onSubmit={editProfileHandler}
                  encType="multipart/form-data"
                >
                  <div className="col-md-6">
                    <MDBInput
                      label=" First Name"
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <MDBInput
                      label=" Last Name"
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <MDBInput
                      label=" company"
                      type="text"
                      name="lastName"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <MDBInput
                      label=" Title"
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <Dropdown
                      value={location}
                      onChange={(e) => setLocation(e.value)}
                      options={countries}
                      optionLabel="name"
                      placeholder={location}
                      filter
                      valueTemplate={selectedCountryTemplate}
                      itemTemplate={countryOptionTemplate}
                      className="w-100"
                    />
                  </div>
                  <div className="col-md-12">
                    <MDBInput
                      label=" "
                      type="file"
                      name="profileImg"
                      accept=".jpg,.jpeg,.png,.avif"
                      onChange={(e) => setProfileImg(e.target.files[0])}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <MDBBtn
                      style={{
                        width: "100%",
                        borderRadius: "50px",
                        backgroundColor: "#387F8E",
                        color: "white",
                      }}
                      className="mt-2"
                    >
                      Save Changes
                    </MDBBtn>
                  </div>
                </MDBValidation>
              </MDBCardBody>
            </MDBCard>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default RecruiterProfile;
