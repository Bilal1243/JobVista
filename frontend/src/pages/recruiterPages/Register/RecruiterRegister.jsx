import { React, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
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
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  useRecruiterRegisterMutation,
  useRecruiterVerifyregisterationMutation,
  useRecruiterGetIndustryTypesMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import logo from "../../../assets/JobVista.png"; // Import the image
import "./RecruiterRegister.css";
import countrydata from "../../../Utils/Countries.js";
import HighestEducations from "../../../Utils/Educations.js";

const RecruiterRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [otp, setOtp] = useState("");
  const [location, setLocation] = useState(null);
  const [gender, Setgender] = useState(null);
  const [industryType, setIndustry] = useState(null);
  const [education, setEducation] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { recruiterData } = useSelector((state) => state.recruiterAuth);
  const [visible, setVisible] = useState(false);

  // country,industries and education data's
  const [countries, setCountries] = useState([]);
  const [highestEducations, setHighestEducations] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [recruiterGetIndustryTypes] = useRecruiterGetIndustryTypesMutation();
  const [recruiterRegister] = useRecruiterRegisterMutation();
  const [recruiterVerifyregisteration] =
    useRecruiterVerifyregisterationMutation();

  const fetchIndustries = async () => {
    try {
      const response = await recruiterGetIndustryTypes();
      setIndustries(response.data.data);
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchIndustries();
    setCountries(countrydata);
    setHighestEducations(HighestEducations);
  }, []);

  useEffect(() => {
    if (recruiterData) {
      navigate("/recruiter");
    }
  }, [navigate, recruiterData]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const mobileRegex = /^\d{10}$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    try {
      if (!mobileRegex.test(mobile)) {
        toast.error("Invalid mobile number. Please enter a 10-digit number");
      } else if (password !== confirmPassword) {
        toast.error("Passwords do not match");
      } else if (!passwordRegex.test(password)) {
        toast.error(
          "Password should have 8 characters,digit,one special character,uppercase and lowercase"
        );
      } else if (password.trim() === "" || !password) {
        toast.error("give a valid password");
      } else if (firstName.trim() === "" || !firstName) {
        toast.error("give a valid name");
      } else if (lastName.trim() === "" || !lastName) {
        toast.error("give a valid name");
      } else if (title.trim() === "" || !title) {
        toast.error("give a valid title");
      } else if (companyName.trim() === "" || !companyName) {
        toast.error("give a valid company");
      } else if (location === null) {
        toast.error("select a valid location");
      } else if (industryType === null) {
        toast.error("select a valid industry");
      } else if (gender === null) {
        toast.error("select gender");
      } else if (education === null) {
        toast.error("please select your highest education");
      } else if (profileImg === null) {
        toast.error("choose profile image");
      } else {
        const res = await recruiterRegister({ email, mobile }).unwrap();
        if (res) {
          setVisible(true);
          setTimer(60);
          startTimer();
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.data);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await recruiterRegister({
        mobile,
        email,
      }).unwrap();
      if (res) {
        setVisible(true);
        setTimer(60);
        startTimer();
      }
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const otpHandler = async () => {
    try {
      if (otp.length < 6) {
        toast.error("Give a proper OTP");
      } else {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("title", title);
        formData.append("companyName", companyName);
        formData.append("location", location.name);
        formData.append("gender", gender.name);
        formData.append("industryType", industryType._id);
        formData.append("education", education.name);
        formData.append("password", password);
        formData.append("otp", otp);
        formData.append("profileImg", profileImg);

        const responseFromApiCall = await recruiterVerifyregisteration(
          formData
        ).unwrap();

        if (responseFromApiCall) {
          toast.success("Registration successful");
          navigate("/recruiterLogin");
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        error.data?.message || "An error occurred. Please try again."
      );
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

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerRunning(false);
    }
  }, [timer]);

  const isMobile = window.innerWidth <= 767;

  return (
    <div>
      <div style={{ display: "flex" }} className="character">
        {/* Left Side (Form and Logo) */}
        <div style={{ flex: 1, marginTop: "25px" }}>
          <div style={{ maxWidth: "500px", margin: "auto" }}>
            {/* Your logo */}

            <MDBCard alignment="center" className="mb-5">
              <div className="mt-3">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "200px", height: "150px" }}
                />
              </div>
              <h2>Recruiter Sign Up</h2>
              <MDBCardBody>
                <MDBValidation
                  onSubmit={submitHandler}
                  noValidate
                  className="row g-3"
                  encType="multipart/form-data"
                >
                  <div className="col-md-6">
                    <MDBInput
                      label="First Name"
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <MDBInput
                      label="Last Name"
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <MDBInput
                      label="Email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <MDBInput
                      label="Mobile"
                      type="tel"
                      name="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <MDBInput
                      label="Title"
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <MDBInput
                      label="Company Name"
                      type="text"
                      name="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12">
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
                  <div className="col-md-12">
                    <Dropdown
                      value={industryType}
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
                  <div className="col-md-12">
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
                  <div className="col-md-12">
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
                  <div className="col-md-12">
                    <MDBInput
                      label="Password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <MDBInput
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      type="submit"
                    >
                      Sign Up
                    </MDBBtn>
                  </div>
                </MDBValidation>
              </MDBCardBody>
              <p style={{ textAlign: "center" }}></p>
              <MDBCardFooter className="mb-2">
                <Link to="/recruiterLogin">
                  <p style={{ color: "black" }}>
                    Already registered?
                    <span style={{ color: "#387F8E" }}> Sign in </span>
                  </p>
                </Link>
              </MDBCardFooter>
            </MDBCard>
          </div>
        </div>

        <div className="card flex justify-content-center">
          <Dialog
            header="Verify OTP"
            visible={visible}
            style={isMobile ? { width: "100%" } : { width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ flex: 1, maxWidth: "450px", margin: "0 15px" }}>
                <MDBCard alignment="center" className="mb-5">
                  <MDBIcon fas icon="user-circle" className="fa-3x " />

                  <MDBCardBody>
                    <MDBValidation
                      noValidate
                      className="row g-3"
                      onSubmit={otpHandler}
                    >
                      <div className="col-md-12">
                        <MDBValidationItem
                          className="col-md-12"
                          feedback="Please Enter yout OTP"
                          invalid
                        >
                          <MDBInput
                            label=" OTP"
                            type="number"
                            name="password"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            validation="Enter the OTP"
                            invalid
                          />
                        </MDBValidationItem>
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
                          Verify OTP
                        </MDBBtn>
                      </div>
                      <div className="col-12">
                        <Link
                          onClick={resendOtp}
                          className="mt-2"
                          disabled={isTimerRunning}
                          style={{
                            pointerEvents: isTimerRunning ? "none" : "auto",
                            color: isTimerRunning ? "gray" : "inherit",
                          }}
                        >
                          Resend OTP {isTimerRunning && `(${timer}s)`}
                        </Link>
                      </div>
                    </MDBValidation>
                  </MDBCardBody>
                </MDBCard>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default RecruiterRegister;
