import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBValidationItem,
  MDBValidation,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import loginBg from "../../../assets/recruiteloginBg.png"; // Import the image
import logo from "../../../assets/JobVista.png"; // Import the image
import "./RecruiterLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../../redux/recruiterSlices/recruiterAuthSlice";
import { useRecruiterLoginMutation } from "../../../redux/recruiterSlices/recruiterApiSlices";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

function RecruiterLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [recruiterLogin] = useRecruiterLoginMutation();

  useEffect(() => {
    if (recruiterData) {
      navigate("/recruiter");
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Both email and password are required.");
    } else {
      try {
        const responseFromApiCall = await recruiterLogin({
          email,
          password,
        }).unwrap();
        if (responseFromApiCall) {
          dispatch(setCredentials({ ...responseFromApiCall }));
          toast.success("Login Sucessfull");
          navigate("/recruiter");
        } else {
          toast.error("no details found");
        }
      } catch (err) {
        toast.error(err.data?.message || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol sm="6">
            <div className="d-flex flex-column justify-content-center h-custom-2 w-75 mt-l-0 mt-3">
              <div className="d-flex flex-row ps-l-5 ps-0 align-items-center justify-content-center">
                <span className="h1 fw-bold mb-3">
                  <img
                    src={logo}
                    style={{ width: "150px", height: "100px" }}
                  ></img>
                </span>
              </div>
              <h2 className="text-center mb-3">Recruiter Login</h2>
              <MDBValidation
                onSubmit={submitHandler}
                noValidate
                className="row g-3"
              >
                <div className="col-md-12">
                  <MDBInput
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    wrapperClass="mb-4 mx-l-5 mx-0 w-100"
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
                    wrapperClass="mb-4 mx-l-5 mx-0 w-100"
                  />
                </div>
                <MDBBtn
                  className="mb-4 px-5 mx-l-5 mx-0 w-100"
                  color="info"
                  size="lg"
                  style={{ color: "white" }}
                >
                  Login
                </MDBBtn>
              </MDBValidation>
              <p className="small mb-2 pb-lg-3 ms-l-5 ms-0">
                <Link to="/recruiterForgotPass" className="text-muted">
                  Forgot password?
                </Link>
              </p>
              <Link to="/recruiterRegister">
                <p className="ms-l-5 ms-0">
                  Don't have an account?{" "}
                  <span className="link-info">Register here</span>
                </p>
              </Link>
            </div>
          </MDBCol>

          <MDBCol
            sm="6"
            className="d-none d-sm-block px-0 mt-5"
            style={{ height: "500px", display: "flex", alignItems: "center" }}
          >
            <img
              src={loginBg}
              alt="Login image"
              style={{
                objectFit: "cover",
                objectPosition: "left",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default RecruiterLogin;
