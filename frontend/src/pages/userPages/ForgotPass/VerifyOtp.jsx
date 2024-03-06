import React from "react";
import { useState, useEffect } from "react";
// import NavBar from '../../../components/userComponents/navBar/NavBar'

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useVerifyOtpMutation } from "../../../redux/userSlices/userApiSlice";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
} from "mdb-react-ui-kit";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { Link, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [verifyOtp] = useVerifyOtpMutation();

  const email = sessionStorage.getItem("forgotPasswordEmail");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!otp) {
        toast.error(" enter otp");
      } else {
        const responseFromApiCall = await verifyOtp({ otp, email }).unwrap()
        console.log('forgot otp console : ', responseFromApiCall)
        if (responseFromApiCall.status) {
          navigate("/changePassword");
        } else {
          toast.error("invalid otp");
        }
      }
    } catch (err) {
      if (err.data && err.data.message) {
        toast.error(err.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="character" style={{ backgroundColor: "#fffff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div style={{ flex: 1, maxWidth: "450px", margin: "0 15px" }}>
          <MDBCard alignment="center" className="mb-5">
            <MDBIcon fas icon="user-circle" className="fa-3x mt-2" />
            <h5 className="mt-2">Enter Your OTP</h5>

            <MDBCardBody>
              <MDBValidation
                noValidate
                className="row g-3"
                onSubmit={submitHandler}
              >
                <div className="col-md-12">
                  <MDBValidationItem
                    className="col-md-12"
                    feedback="Please Enter the OTP"
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
              </MDBValidation>
            </MDBCardBody>
            <p style={{ textAlign: "center" }}></p>
            <MDBCardFooter className="mb-2"></MDBCardFooter>
          </MDBCard>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
