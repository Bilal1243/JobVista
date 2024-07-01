import { MDBInput, MDBValidation } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "./Actions.css";
import Select from "react-select";
import {
  useGetSkillsMutation,
  useAddSkillsMutation,
  useJobPreferenceAndSkillsMutation,
  useDeleteSkillMutation,
  useAddJobPreferenceMutation,
} from "../../../redux/userSlices/userApiSlice";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";

function Personalinformation({ activeTab, profileData, forChildComponents }) {
  const [jobPreference, setJobPreference] = useState({});
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [minPay, setMinPay] = useState("");

  const [isLoading, setIsloading] = useState(true);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState();

  const [getSkills] = useGetSkillsMutation();
  const [addSkills] = useAddSkillsMutation();
  const [jobPreferenceAndSkills] = useJobPreferenceAndSkillsMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [addJobPreference] = useAddJobPreferenceMutation();

  const fetchjobPreference = async () => {
    try {
      const result = await jobPreferenceAndSkills({
        userId: profileData._id,
      }).unwrap();
      setJobPreference(result.JobPreference);
      setSelectedSkills(result.skills.skills);
      setIsloading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  useEffect(() => {
    if (jobPreference !== null) {
      setJobTitle(jobPreference.jobTitle);
      setJobType(jobPreference.jobType);
      setMinPay(jobPreference.minPay);
    }
  }, [jobPreference]);

  const fetchSkills = async () => {
    try {
      const skills = await getSkills({ userId: profileData._id }).unwrap();
      setSkillsData(skills.data);
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const jobTypeOptions = [
    { val: "Full-Time" },
    { val: "Part-Time" },
    { val: "Contract" },
    { val: "Temporary" },
    { val: "Freelance" },
  ];

  useEffect(() => {
    fetchjobPreference();
    fetchSkills();
  }, []);

  const jobTypes = jobTypeOptions.map((option) => ({
    value: option.val,
    label: option.val,
  }));

  const handleSkillChange = async (selectedOption) => {
    if (selectedOption) {
      const newSkill = { _id: selectedOption._id, skill: selectedOption.value };
      setSelectedSkill("");

      try {
        // Add the new skill to the backend
        const response = await addSkills({
          userId: profileData._id,
          skills: [newSkill],
        }).unwrap();

        if (selectedSkills.length > 1) {
          // Update the state with the new skill received from the backend
          setSelectedSkills((prevSkills) => [
            ...prevSkills,
            {
              _id: response?.data?.skill._id,
              skill: response?.data?.skill.skill,
            },
          ]);
        } else {
          setSelectedSkills([{
            _id: response?.data?.skill._id,
            skill: response?.data?.skill.skill,
          }]);
        }

        toast.success(response?.message);

        fetchjobPreference();

        await forChildComponents();
      } catch (error) {
        toast.error(error?.data?.message || error?.data);
      }
    }
  };

  const skillOption = skillsData.map((skills) => ({
    value: skills.skill,
    label: skills.skill,
    _id: skills._id,
  }));

  const removeSkill = async (skillId) => {
    try {
      const deleteResponse = await deleteSkill({
        userId: profileData._id,
        skillId,
      }).unwrap();
      toast.success("removed succeffully");
      fetchjobPreference();
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  const filteredSkillOptions = skillOption.filter((skill) => {
    const isNotSelected = !(
      selectedSkills?.some(
        (selectedSkill) => selectedSkill._id === skill._id
      ) ?? false
    );
    return isNotSelected;
  });

  const addPreference = async () => {
    try {
      const jobResult = await addJobPreference({
        userId: profileData._id,
        jobTitle,
        jobType,
        minPay,
      }).unwrap();
      toast.success(jobResult?.message);
      fetchjobPreference();
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  console.log(selectedSkills)

  return (
    <>
      <div
        className={`p-2 tab-pane ${
          activeTab === "personal-information" ? "active" : ""
        }`}
        id="followers"
      >
        <h5>Job Preference & Skills</h5>
        <hr />
        <div className="card p-4">
          {jobPreference === null ? (
            <h6>Add job Preference</h6>
          ) : (
            <h6>Current job Preference</h6>
          )}
          <hr />
          <div className="form-group mt-1">
            <label htmlFor="jobTitle">Job Title</label>
            <MDBInput
              type="text"
              className="form-control"
              id="jobTitle"
              aria-describedby="fullNameHelp"
              placeholder="Enter job title"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
              }}
            ></MDBInput>
          </div>

          <div className="form-group mt-2">
            <p>Selected JobType: {jobType ? jobType : "nothing selected"}</p>
          </div>

          <div className="form-group">
            <label htmlFor="jobtype">Job Type</label>
            <Select
              options={jobTypes}
              value={jobType}
              onChange={(selectedOption) => setJobType(selectedOption.value)}
              isSearchable
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="jobtype">Minimum pay</label>
            <MDBInput
              type="text"
              className="form-control"
              id="jobtype"
              aria-describedby="fullNameHelp"
              placeholder="Enter expected ctc"
              value={minPay}
              onChange={(e) => {
                setMinPay(e.target.value);
              }}
            ></MDBInput>
          </div>
          <div className="d-flex justify-content-center pt-3">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!jobType && !jobTitle && !minPay}
              onClick={() => addPreference()}
            >
              Update
            </button>
            <button
              type="reset"
              className="btn btn-light ml-2"
              onClick={() => fetchjobPreference()}
            >
              Reset Changes
            </button>
          </div>
        </div>

        <div className="card p-4 mt-2" style={{ minHeight: "400px" }}>
          <h6>Skills</h6>
          <hr />
          {/* <p>{userSkills === false && "you didnt added skills yet"}</p> */}
          <MDBValidation>
            <div className="form-group mt-2">
              <label htmlFor="skills">add skills</label>
              <Select
                options={filteredSkillOptions}
                value={selectedSkill}
                onChange={handleSkillChange}
                isSearchable
              />
            </div>

            {/* Display the current added skills as tags */}
            <div className="col-12 mt-3 d-flex flex-wrap ">
              {selectedSkills?.map((skill, index) => (
                <div
                  key={index}
                  className="col-md-3 col-lg-3 d-flex align-items-center badge badge-light m-1 p-3"
                  style={{
                    borderRadius: "12px",
                    cursor: "pointer",
                    color: "black",
                    justifyContent: "space-between", // This will space the content evenly
                  }}
                >
                  {`${skill.skill}`}
                  <i
                    className="pi pi-times"
                    style={{ color: "green" }}
                    onClick={() => removeSkill(skill._id)}
                  ></i>
                </div>
              ))}
            </div>
          </MDBValidation>
        </div>
      </div>
    </>
  );
}

export default Personalinformation;
