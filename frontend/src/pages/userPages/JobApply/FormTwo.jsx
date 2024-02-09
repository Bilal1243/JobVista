import React, { useEffect, useState } from "react";
import "./JobApply.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { MDBBtn, MDBInput, MDBValidation } from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const inputController = (
  questionType,
  options,
  question,
  userAnswers,
  handleAnswerChange
) => {
  const previousAnswer = userAnswers.find(
    (answer) => answer.question === question.question
  );

  if (questionType === "User Input") {
    return (
      <MDBInput
        type="email"
        name="email"
        placeholder="enter answer"
        required
        value={previousAnswer ? previousAnswer.answer : ""}
        onChange={(e) =>
          handleAnswerChange({
            question: question.question,
            answer: e.target.value,
          })
        }
      />
    );
  } else if (questionType === "Yes/No") {
    return (
      <>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`inlineCheckbox_${question.question}`}
            checked={previousAnswer ? previousAnswer.answer === "Yes" : false}
            onChange={() =>
              handleAnswerChange({
                question: question.question,
                answer: "Yes",
              })
            }
          />
          <label
            className="form-check-label"
            htmlFor={`inlineCheckbox_${question.question}`}
          >
            Yes
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`inlineCheckbox_${question.question}_No`}
            checked={previousAnswer ? previousAnswer.answer === "No" : false}
            onChange={() =>
              handleAnswerChange({
                question: question.question,
                answer: "No",
              })
            }
          />
          <label
            className="form-check-label"
            htmlFor={`inlineCheckbox_${question.question}_No`}
          >
            No
          </label>
        </div>
      </>
    );
  } else {
    return (
      <>
        {options.map((option, index) => (
          <div className="form-check" key={index}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`inlineCheckbox_${question.question}_${index}`}
              checked={
                previousAnswer ? previousAnswer.answer === option : false
              }
              onChange={() =>
                handleAnswerChange({
                  question: question.question,
                  answer: option,
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor={`inlineCheckbox_${question.question}_${index}`}
            >
              {option}
            </label>
          </div>
        ))}
      </>
    );
  }
};

function FormTwo({ setActiveForm, questions, setUserAnswers, userAnswers }) {
  const [errorMsg, setErrorMsg] = useState(null);

  const handleAnswerChange = (answerObj) => {
    setUserAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (ans) => ans.question === answerObj.question
      );

      if (existingAnswerIndex !== -1) {
        // If the question is already in answers, update the answer
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = answerObj;
        return updatedAnswers;
      } else {
        // If the question is not in the answers, add a new object
        return [...prevAnswers, answerObj];
      }
    });
  };

  const handleSubmit = () => {
    try {
      // Check if there are any unanswered questions
      const unansweredQuestions = questions.filter(
        (question) =>
          !userAnswers.find((answer) => answer.question === question.question)
      );

      if (unansweredQuestions.length > 0) {
        setErrorMsg("Please answer all questions.");
      } else {
        setActiveForm("experience");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <div className="m-sm-4">
        {questions.map((question, index) => (
          <div className="col-md-12 mb-3" key={index}>
            <label
              style={{ fontSize: "16px", fontWeight: "500" }}
              className="mb-2"
            >
              {question.question}
            </label>
            {inputController(
              question.questionType,
              question.options,
              question,
              userAnswers,
              handleAnswerChange
            )}
          </div>
        ))}
        {errorMsg !== null && <p style={{ color: "red" }}>{errorMsg}</p>}
        <div className="col-12 d-flex justify-content-center">
          <MDBBtn
            style={{
              width: "50%",
              borderRadius: "50px",
              backgroundColor: "#387F8E",
              color: "white",
            }}
            className="mt-2"
            onClick={handleSubmit}
          >
            Continue
          </MDBBtn>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button
            style={{
              width: "30%",
              borderRadius: "50px",
              backgroundColor: "black",
              color: "white",
              padding: "10px",
              border: "none",
            }}
            onClick={() => {
              setActiveForm("resume");
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
}

export default FormTwo;
