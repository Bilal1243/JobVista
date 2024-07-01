import React, { useEffect, useState } from "react";
import "./JobApply.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarUi from "../../../components/Navbars/Navbar";

import {
  useUserViewJobMutation,
  useGetProfileMutation,
  useApplyJobMutation,
} from "../../../redux/userSlices/userApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormFirst from "./FormFirst";
import FormTwo from "./FormTwo";
import FormThree from "./FormThree";

function JobApply() {
  const { userData } = useSelector((state) => state.auth);

  const { jobId } = useParams();
  const [userProfile, setUserProfile] = useState({});
  const [activeForm, setActiveForm] = useState("resume");

  const [resume, setResume] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  const navigate = useNavigate();

  const [job, setJob] = useState({});
  const [questions, setQuestions] = useState([]);

  const [showMore, setShowMore] = useState(false);

  const [UserViewJob] = useUserViewJobMutation();
  const [getProfile] = useGetProfileMutation();
  const [applyJob] = useApplyJobMutation();

  const fetchJob = async () => {
    try {
      const job = await UserViewJob({ userId: userData._id, jobId }).unwrap();
      setJob(job);
      setQuestions(job.questions[0].questions);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getProfile({ userId: userData._id }).unwrap();
      setUserProfile(response.data);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    fetchJob();
    fetchProfile();
  }, [jobId]);

  const handleFileChange = (e) => {
    // Assuming you only allow one file to be uploaded
    const selectedFile = e.target.files[0];
    setResume(selectedFile);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userProfile._id);
      formData.append("jobId", jobId);
      title.length > 0 && formData.append("title", title);
      company.length > 0 && formData.append("company", company);

      // Append userAnswers as individual items
      userAnswers.forEach((answer, index) => {
        Object.entries(answer).forEach(([key, value]) => {
          formData.append(`questionReply[${index}][${key}]`, value);
        });
      });

      formData.append("resume", resume);

      if (!resume) {
        return toast.error("add resume");
      }

      const response = await applyJob(formData);
      navigate(`/applied/${jobId}`);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  return (
    <>
      <NavbarUi></NavbarUi>
      <div className="container h-100" style={{ marginTop: "150px" }}>
        <div className="row h-100">
          <div className="col-sm-12 col-md-7 col-lg-7 d-table h-100">
            <div className="d-table-cell align-middle">
              <div className="d-flex align-items-center justify-content-between mt-4 p-2">
                {activeForm === "resume" && (
                  <h6 className="h5">Add Resume for the employer</h6>
                )}
                {activeForm === "second" && (
                  <h6 className="h5">
                    Give some details for the recruiter questions
                  </h6>
                )}
                {activeForm === "experience" && (
                  <h6 className="h5">
                    Enter a past job that shows relevant experience (optional)
                  </h6>
                )}
                <Link to={"/jobs"}>exit</Link>
              </div>

              <div className="card">
                <div className="card-body">
                  {activeForm === "resume" && (
                    <FormFirst
                      resume={resume}
                      handleFileChange={handleFileChange}
                      setActiveForm={setActiveForm}
                      questions={questions}
                    ></FormFirst>
                  )}
                  {activeForm === "second" && (
                    <FormTwo
                      setActiveForm={setActiveForm}
                      questions={questions}
                      userAnswers={userAnswers}
                      setUserAnswers={setUserAnswers}
                    />
                  )}
                  {activeForm === "experience" && (
                    <FormThree
                      setActiveForm={setActiveForm}
                      title={title}
                      setTitle={setTitle}
                      company={company}
                      setCompany={setCompany}
                      handleSubmit={handleSubmit}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-md-5 col-lg-5 d-none d-md-block"
            style={{ position: "fixed", top: "150px", right: "10px" }}
          >
            <div className="card">
              <div className="card-body">
                <h6>{job.jobRole}</h6>
                <p>{job.company}</p>
                <p>{job.location}</p>
                <hr />
                <div
                  style={{
                    maxHeight: showMore ? "200px" : "98px",
                    overflowY: showMore ? "auto" : "hidden",
                  }}
                >
                  <h6 style={{ fontWeight: "500" }}>Job Description : </h6>
                  <p>{job.description}</p>

                  <h6 style={{ fontWeight: "400" }} className="mt-2 mb-3">
                    Experience : {job.experience?.minimum}
                    &nbsp;-&nbsp;
                    {job.experience?.maximum} years
                  </h6>

                  <h6 style={{ fontWeight: "400" }} className="mb-3">
                    Location : {job.location}
                  </h6>
                  <h6 style={{ fontWeight: "400" }} className="mb-3">
                    Education : {job.qualification}
                  </h6>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <p
                    className="d-flex align-items-center"
                    onClick={handleShowMore}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    {showMore ? (
                      <>
                        Show Less <i className="fas fa-angle-up"></i>
                      </>
                    ) : (
                      <>
                        Show More <i className="fas fa-angle-down"></i>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default JobApply;
