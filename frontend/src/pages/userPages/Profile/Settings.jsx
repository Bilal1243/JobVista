import React, { useState, useEffect } from "react";
import {
  useUserChangePasswordMutation,
  useGetIndustryTypesMutation,
  useAddDetailsMutation,
  useUserLogoutMutation,
} from "../../../redux/userSlices/userApiSlice";
import { toast } from "react-toastify";
import {
  logout,
  setCredentials,
} from "../../../redux/userSlices/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "primereact/dropdown";

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import countrydata from "../../../Utils/Countries";
import highestEducation from "../../../Utils/Educations";

function Settings({ activeTab, profileData , forChildComponents}) {
  const [CurrPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [mobile, setMobile] = useState(
    profileData.mobile ? profileData.mobile : ""
  );
  const [title, setTitle] = useState(
    profileData.title ? profileData.title : ""
  );
  const { userData } = useSelector((state) => state.auth);
  const [location, setLocation] = useState(
    profileData.location ? profileData.location : ""
  );
  const [gender, Setgender] = useState(
    profileData.gender ? profileData.gender : ""
  );
  const [industry, setIndustry] = useState(
    profileData.industryType ? profileData.industryType : ""
  );
  const [education, setEducation] = useState(
    profileData.education ? profileData.education : ""
  );
  const [industries, setIndustries] = useState([]);

  const [countries, setCountries] = useState([]);
  const [highestEducations, setHighestEducations] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userChangePassword] = useUserChangePasswordMutation();
  const [userLogout] = useUserLogoutMutation();
  const [getIndustryTypes] = useGetIndustryTypesMutation();
  const [addDetails] = useAddDetailsMutation();

  const fetchIndustries = async () => {
    try {
      const response = await getIndustryTypes();
      setIndustries(response.data.data);
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    setCountries(countrydata);
    setHighestEducations(highestEducation);
    fetchIndustries();
  }, []);

  const handleChangePassword = async () => {
    try {
      if (newPassword.trim() === "" || !newPassword) {
        toast.error("password must be valid");
      } else if (newPassword.length <= 7) {
        toast.error("password must be greater than 7 characters");
      } else if (confirmNewPass !== newPassword) {
        toast.error("new password is not matching with confirm password");
      } else {
        const response = await userChangePassword({
          newPass: newPassword,
          oldPass: CurrPassword,
        }).unwrap();
        if (response.success) {
          toast.success(response.message);
          setConfirmNewPass("");
          setNewPassword("");
          setCurrentPassword("");
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  const submitDetails = async (e) => {
    e.preventDefault();

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Invalid mobile number. Please enter a 10-digit number");
    } else {
      const responseFromApiCall = await addDetails({
        id: profileData._id,
        mobile,
        gender,
        industry,
        location,
        education,
        title,
      }).unwrap();
      if (responseFromApiCall) {
        toast.success("profile updated");
        dispatch(setCredentials(responseFromApiCall));
        forChildComponents();
      }
    }
  };

  const genderOptions = [
    { name: "Male" },
    { name: "Female" },
    { name: "Other" },
  ];

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

  const selectedIndustryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.industryName}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const IndustryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.industryName}</div>
      </div>
    );
  };

  const logoutUser = async () => {
    try {
      await userLogout().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  return (
    <>
      <div
        className={`tab-pane ${activeTab === "settings" ? "active" : ""}`}
        id="settings"
      >
        <h6>ACCOUNT SETTINGS</h6>
        <hr />
        <MDBCard className="mb-5">
          <MDBCardBody>
            <h6>edit or add profile details</h6>
            <MDBValidation
              onSubmit={submitDetails}
              noValidate
              className="row g-3"
            >
              <div className="col-md-6">
                <MDBValidationItem className="col-md-12">
                  <MDBInput
                    label="Mobile"
                    type="tel"
                    name="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    validation="Please provide your mobile number"
                    invalid
                  />
                </MDBValidationItem>
              </div>
              <div className="col-md-6">
                <MDBInput
                  label="title"
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <Dropdown
                  value={location}
                  onChange={(e) => setLocation(e.value)}
                  options={countries}
                  optionLabel="name"
                  placeholder="Select a Country"
                  filter
                  valueTemplate={selectedCountryTemplate}
                  itemTemplate={countryOptionTemplate}
                  className="w-100"
                />
              </div>
              <div className="col-md-6">
                <Dropdown
                  value={industry}
                  onChange={(e) => setIndustry(e.value)}
                  options={industries}
                  optionLabel="name"
                  placeholder="Select industry Type"
                  filter
                  valueTemplate={selectedIndustryTemplate}
                  itemTemplate={IndustryOptionTemplate}
                  className="w-100"
                />
              </div>
              <div className="col-md-6">
                <Dropdown
                  value={gender}
                  onChange={(e) => Setgender(e.value)}
                  options={genderOptions}
                  optionLabel="name"
                  placeholder="Select gender"
                  filter
                  valueTemplate={selectedCountryTemplate}
                  itemTemplate={countryOptionTemplate}
                  className="w-100"
                />
              </div>
              <div className="col-md-6">
                <Dropdown
                  value={education}
                  onChange={(e) => setEducation(e.value)}
                  options={highestEducations}
                  optionLabel="name"
                  placeholder="Select Highest Education"
                  filter
                  valueTemplate={selectedCountryTemplate}
                  itemTemplate={countryOptionTemplate}
                  className="w-100"
                />
              </div>
              <div className="col-12">
                <MDBBtn
                  type="submit"
                  style={{
                    width: "100%",
                    borderRadius: "50px",
                    backgroundColor: "#387F8E",
                    color: "white",
                  }}
                  className="mt-2"
                >
                  Continue
                </MDBBtn>
              </div>
            </MDBValidation>
          </MDBCardBody>
          <p style={{ textAlign: "center" }}></p>
        </MDBCard>
        <form>
          <div class="form-group">
            <label for="username" className="mb-2">
              Change Password
            </label>
            <div className="form-group mb-2">
              <input
                type="password"
                class="form-control"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter old password"
                value={CurrPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                class="form-control"
                id="username1"
                aria-describedby="usernameHelp"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                class="form-control"
                id="username2"
                aria-describedby="usernameHelp"
                placeholder="Confirm new password"
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success"
                type="button"
                onClick={() => handleChangePassword()}
              >
                change password
              </button>
            </div>
          </div>
          <hr />
          <button
            class="btn btn-danger"
            type="button"
            onClick={() => logoutUser()}
          >
            Logout
          </button>
        </form>
      </div>
    </>
  );
}

export default Settings;
