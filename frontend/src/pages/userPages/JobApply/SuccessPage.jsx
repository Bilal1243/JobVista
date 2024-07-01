import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import NavbarUi from "../../../components/Navbars/Navbar";
import "./SuccessPage.css";

function SuccessPage() {
  const { jobId } = useParams();

  const navigate = useNavigate()

  return (
    <>
      <NavbarUi></NavbarUi>
      <div>
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <section class="mail-seccess section">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-12">
                <div class="success-inner">
                  <h1>
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Your application has been submitted!</span>
                  </h1>
                  <button
                    style={{
                      color: "blue",
                      padding: "15px",
                      borderRadius: "15px",
                      width: "40%",
                      border: "none",
                    }}
                    onClick={()=>navigate('/jobs')}
                  >
                    Return to job search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default SuccessPage;
