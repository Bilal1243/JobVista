import React, { useEffect, useState } from "react";
import {
  useUserlistExperienceMutation,
  useUserAddExperienceMutation,
} from "../../../redux/userSlices/userApiSlice";
import { useSelector } from "react-redux";
import "./Profile.css";
import "./Actions.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MDBInput } from "mdb-react-ui-kit";
import Loader from "../../../components/Loader";

function Experience({ activeTab }) {
  const { userData } = useSelector((state) => state.auth);

  const [experiences, setExperiences] = useState(null);
  const [experience, setExperience] = useState({
    company: "",
    role: "",
    period: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [userlistExperience] = useUserlistExperienceMutation();
  const [userAddExperience] = useUserAddExperienceMutation();

  const fetchExperiences = async () => {
    try {
      const fetchExperience = await userlistExperience({
        userId: userData._id,
      }).unwrap();
      setExperiences(fetchExperience);
      setIsLoading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const addExperience = async () => {
    if (
      experience.company === "" ||
      experience.role === "" ||
      experience.period === ""
    ) {
      return;
    }
    try {
      const response = userAddExperience({
        userId: userData._id,
        experience: experience,
      });
      setExperience({
        company: "",
        role: "",
        period: "",
      });
      setIsLoading(true);
      fetchExperiences();
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <>
      <div
        className={`tab-pane ${activeTab === "experience" ? "active" : ""}`}
        id="experience"
      >
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <>
            {experiences && (
              <>
                <h6>Previous Experience</h6>
                {experiences.experiences.map((exp, index) => (
                  <div className="card" key={index}>
                    <div className="card-body">
                      <h5>Company : {exp.company}</h5>
                      <p>role : {exp.role}</p>
                      <p>number of years : {exp.period}</p>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="card p-4">
              <h6>Add New Experience</h6>
              <hr />
              <div className="form-group mt-1">
                <label htmlFor="jobTitle">Company</label>
                <MDBInput
                  type="text"
                  className="form-control"
                  id="jobTitle"
                  aria-describedby="fullNameHelp"
                  placeholder="Enter job title"
                  name="company"
                  value={experience.company}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setExperience({ ...experience, [name]: value });
                  }}
                ></MDBInput>
              </div>

              <div className="form-group mt-2">
                <label htmlFor="jobtype">Role</label>
                <MDBInput
                  type="text"
                  className="form-control"
                  id="jobtype"
                  aria-describedby="fullNameHelp"
                  placeholder="Enter expected ctc"
                  name="role"
                  value={experience.role}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setExperience({ ...experience, [name]: value });
                  }}
                ></MDBInput>
              </div>
              <div className="form-group mt-2">
                <label htmlFor="jobtype">Period</label>
                <MDBInput
                  type="number"
                  className="form-control"
                  id="jobtype"
                  aria-describedby="fullNameHelp"
                  placeholder="Enter year"
                  name="period"
                  value={experience.period}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setExperience({ ...experience, [name]: value });
                  }}
                ></MDBInput>
              </div>
              <div className="d-flex justify-content-center pt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addExperience()}
                >
                  Update
                </button>
                <button
                  type="reset"
                  className="btn btn-light ml-2"
                  onClick={() => {
                    setExperience({
                      company: "",
                      role: "",
                      period: "",
                    });
                  }}
                >
                  Reset Changes
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Experience;
