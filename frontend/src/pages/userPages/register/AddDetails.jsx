import { React, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  useGetIndustryTypesMutation,
  useAddDetailsMutation,
} from "../../../redux/userSlices/userApiSlice";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import logo from "../../../assets/JobVista.png"; // Import the image
import "./Register.css";
import countrydata from "../../../Utils/Countries";
import highestEducation from "../../../Utils/Educations";

import { setCredentials } from "../../../redux/userSlices/userAuthSlice";

const AddDetails = () => {
  const [mobile, setMobile] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const [location, setLocation] = useState(null);
  const [gender, Setgender] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [education, setEducation] = useState(null);
  const [industries, setIndustries] = useState([]);

  const [countries, setCountries] = useState([]);
  const [highestEducations, setHighestEducations] = useState([]);

  const { id } = useParams();

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

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [navigate, userData]);

  const submitDetails = async (e) => {
    e.preventDefault();

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Invalid mobile number. Please enter a 10-digit number");
    } else {
      const responseFromApiCall = await addDetails({
        id,
        mobile,
        gender,
        industry,
        location,
        education,
        title,
      }).unwrap();
      console.log(responseFromApiCall);
      if (responseFromApiCall) {
        toast.success("registration sucessfull");
        dispatch(setCredentials({ ...responseFromApiCall }));
        navigate(`/`);
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

  return (
    <div>
      <div style={{ display: "flex" }} className="character">
        {/* Left Side (Form and Logo) */}
        <div style={{ flex: 1, marginTop: "25px" }}>
          <div style={{ maxWidth: "600px", margin: "auto" }}>
            {/* Your logo */}

            <MDBCard alignment="center" className="mb-5">
              <div className="mt-3">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "225px", height: "150px" }}
                />
              </div>
              <h2>Add Some Details</h2>
              <MDBCardBody>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDetails;
