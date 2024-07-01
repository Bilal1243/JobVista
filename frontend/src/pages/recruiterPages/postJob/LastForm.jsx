import React, { useEffect, useRef, useState } from "react";
import "./PostJob.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "primereact/button";
import { MDBValidation, MDBInput, MDBCheckbox, MDBBtn } from "mdb-react-ui-kit";
import Select from "react-select"; // Import react-select

import jobBanner from "../../../assets/job-banner-2.avif";
import HighestEducations from "../../../Utils/Educations";

const types = [
  { type: "Yes/No" },
  { type: "List Options" },
  { type: "User Input" },
];

import "primeicons/primeicons.css";

function LastForm({ activeForm, setActiveForm, setQuestions, questions , setContactAllowed,contactAllowed,createPost}) {
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    expectedAns: null,
    questionType: null,
    options: [],
    optionCount: null,
  });

  const typeOptions = types.map((type) => ({
    label: type.type,
    value: type.type,
  }));

  const OptionCounts = Array.from({ length: 5 }, (_, index) => ({
    label: (index + 1).toString(),
    value: index + 1,
  }));

  const handleInputChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;

    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  const handleTypeChange = (selectedOption) => {
    setCurrentQuestion({ ...currentQuestion, questionType: selectedOption });
  };

  const handleOptionCount = (selectedOption) => {
    setCurrentQuestion({ ...currentQuestion, optionCount: selectedOption });
  };

  const addQuestion = () => {
    const newQuestion = {
      question: currentQuestion.question,
      expectedAns:
        currentQuestion.expectedAns === null
          ? null
          : currentQuestion.expectedAns,
      questionType: currentQuestion.questionType.value,
      options:
        currentQuestion.options.length > 0 ? currentQuestion.options : null,
      optionCount:
        currentQuestion.optionCount !== null
          ? currentQuestion.optionCount.value
          : null,
    };
    const newQuestions = Array.isArray(questions)
      ? [...questions, newQuestion]
      : [newQuestion];
    setQuestions(newQuestions);
    setCurrentQuestion({
      question: "",
      expectedAns: "",
      questionType: null,
      options: [],
      optionCount: null,
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const divs = Array.from(
    { length: currentQuestion.optionCount?.value },
    (_, index) => (
      <div key={index} className="col-md-3">
        <label>Option {index + 1}</label>
        <MDBInput
          value={currentQuestion.options[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      </div>
    )
  );

  return (
    <>
      <div className="col-md-12 card-body">
        <div
          className="col-12 d-flex justify-content-between align-items-center p-5"
          style={{ backgroundColor: "#fafafa", borderRadius: "15px" }}
        >
          <div className="text-bottom">
            <h4 className="ms-3">Add Questions for Applicants</h4>
          </div>
          <img
            className=""
            src={jobBanner}
            alt=""
            style={{ width: "250px", height: "175px", opacity: 0.7 }} // Adjust the opacity value as needed
          />
        </div>
        <div className="row col-12">
          <div className="col-md-12 mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="inlineCheckbox1"
              value="Yes"
              checked={contactAllowed === true}
              onClick={()=> setContactAllowed(!contactAllowed)}
            />
            <label class="form-check-label" for="inlineCheckbox1">
              Show email and mobile number for applicant
            </label>
          </div>
          <div className="col-md-6">
            <label>Question</label>
            <MDBInput
              label="Question"
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
            ></MDBInput>
          </div>
          <div className="col-md-3">
            <label>Expected Answer(optional)</label>
            <MDBInput
              label="Answer"
              value={currentQuestion.expectedAns}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  expectedAns: e.target.value,
                })
              }
            ></MDBInput>
          </div>
          <div className="col-md-3">
            <label>Question Type</label>
            <Select
              options={typeOptions}
              onChange={handleTypeChange}
              value={currentQuestion.questionType}
            ></Select>
          </div>
          {currentQuestion.questionType?.value === "List Options" ? (
            <div className="col-md-3">
              <label>Option Count</label>
              <Select
                options={OptionCounts}
                onChange={handleOptionCount}
                value={currentQuestion.optionCount}
              ></Select>
            </div>
          ) : null}
          {currentQuestion.questionType?.value === "List Options" && divs}
          <div className="d-flex align-items-center justify-content-center p-2">
            <MDBBtn onClick={addQuestion}>
              Add Question <i className="pi pi-check"></i>
            </MDBBtn>
          </div>
        </div>
        {questions.length > 0 ? (
          <>
            <div className="col-12">
              {questions.reverse().map((question, index) => {
                return (
                  <div
                    className="col-12"
                    style={{
                      backgroundColor: "#f0f0f0",
                      color: "#000",
                      padding: "15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h5>{question.question}</h5>
                    <i
                      className="pi pi-times"
                      onClick={() => removeQuestion(index)}
                    ></i>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
        <div className="col-12 d-flex align-items-center justify-content-between">
          <MDBBtn onClick={() => setActiveForm("third")}>
            <i className="pi pi-angle-left"></i> Back
          </MDBBtn>
          <Button
            label="Confirm"
            icon="pi pi-check"
            iconPos="right"
            style={{ borderRadius: "20px" }}
            raised
            onClick={()=>createPost()}
          />
        </div>
      </div>
    </>
  );
}

export default LastForm;
