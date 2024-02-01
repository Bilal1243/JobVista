import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import AdminNavbar from "../../../components/adminComponents/Navbar/adminNavbar";
import "./RecruiterRequests.css";
import { toast } from "react-toastify";
import { PROFILE_PATH } from "../../../Utils/URL";

import {
  useAdminGetRecruiterRequestsMutation,
  useAdminAcceptRecruiterMutation,
} from "../../../redux/adminSlices/adminApiSlice";

const RecruiterRequests = () => {
  const [visible, setVisible] = useState(false);
  const [recruiters, setRecruiterData] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [recruiterId, setRecruiterId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [AdminGetRecruiterRequests] = useAdminGetRecruiterRequestsMutation();
  const [AdminAcceptRecruiter] = useAdminAcceptRecruiterMutation();

  const fetchData = async () => {
    try {
      const responseFromApiCall = await AdminGetRecruiterRequests();
      const recruitersArray = responseFromApiCall.data.data;
      setRecruiterData(recruitersArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAgree = async () => {
    try {
      const responseFromApiCall = await AdminAcceptRecruiter({
        recruiterId: recruiterId,
      });
      if (responseFromApiCall) {
        toast.success("Accepted Successfully.");
        fetchData();
        setSelectedRecruiter(null);
        setShowModal(false);
      }
    } catch (err) {
      toast.error(err?.data || err?.data?.message);
    }
  };

  const renderCard = (recruiter) => (
    <Card
      key={recruiter._id}
      className="p-shadow-4 recruiter-card"
      title={recruiter.recruiterName}
      subTitle={recruiter.location}
      header={
        <img
          alt="Card"
          src={PROFILE_PATH + recruiter.profileImg}
          className="card-image"
        />
      }
    >
      <div className="card-details">
        <strong>Title:</strong> {recruiter.title}
        <br />
        <strong>Company:</strong> {recruiter.companyName}
        <br />
        <strong>Industry:</strong> {recruiter.industryType[0]}
        <br />
        <strong>Email:</strong> {recruiter.email}
        <br />
        <strong>Mobile:</strong> {recruiter.mobile}
        <br />
        <div className="d-flex button-container">
          <Button
            label="View"
            icon="pi pi-image"
            className="p-button-info"
            onClick={() => {
              setSelectedRecruiter(recruiter);
              setVisible(true);
            }}
          />
          <Button
            label="Approve Guide"
            className="p-button-success"
            onClick={() => {
              setRecruiterId(recruiter._id);
              setShowModal(true);
            }}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="recruiter-requests-container">
      <AdminNavbar />
      <div className="recruiter-cards-container">
        {recruiters.length > 0 ? (
          <>
            <div className="recruiter-requests-heading">
              <h3>Recruiter Requests</h3>
            </div>
            <div className="card-container">
            {recruiters.map((recruiter, index) => (
              <Card
                key={recruiter._id}
                className="p-shadow-4 recruiter-card"
                title={recruiter.recruiterName}
                subTitle={recruiter.location}
                header={
                  <img
                    alt="Card"
                    src={PROFILE_PATH + recruiter.profileImg}
                    className="card-image"
                  />
                }
              >
                <div className="card-details">
                  <strong>Title:</strong> {recruiter.title}
                  <br />
                  <strong>Company:</strong> {recruiter.companyName}
                  <br />
                  <strong>Industry:</strong> {recruiter.industryType[0]}
                  <br />
                  <strong>Email:</strong> {recruiter.email}
                  <br />
                  <strong>Mobile:</strong> {recruiter.mobile}
                  <br />
                  <div className="d-flex button-container">
                    <Button
                      label="View"
                      icon="pi pi-image"
                      className="p-button-info"
                      onClick={() => {
                        setSelectedRecruiter(recruiter);
                        setVisible(true);
                      }}
                    />
                    <Button
                      label="Approve Guide"
                      className="p-button-success"
                      onClick={() => {
                        setRecruiterId(recruiter._id);
                        setShowModal(true);
                      }}
                    />
                  </div>
                </div>
              </Card>
              
            ))}
            </div>
          </>
        ) : (
          <div className="recruiter-requests-heading">
            <h3>No Requests</h3>
          </div>
        )}
      </div>
      <Dialog
        visible={showModal}
        style={{ width: "30%" }}
        onHide={() => setShowModal(false)}
        header="Confirm Request"
        modal
        footer={
          <div className="dialog-footer">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowModal(false)}
              className="p-button-secondary"
            />
            <Button
              label="Accept"
              icon="pi pi-check"
              onClick={handleAgree}
              className="p-button-success"
            />
          </div>
        }
      >
        <p>Are you sure you want to accept this Recruiter?</p>
      </Dialog>
      <Dialog
        visible={visible}
        style={{ width: "40%" }}
        onHide={() => setVisible(false)}
        header="ID Card"
        modal
      >
        {selectedRecruiter && (
          <Card
            title={selectedRecruiter.recruiterName}
            subTitle={selectedRecruiter.location}
            header={
              <img
                alt="Card"
                src={PROFILE_PATH + selectedRecruiter.profileImg}
                className="card-image"
              />
            }
            className="p-shadow-4 zoom-in-card"
          >
            <div className="card-details">
              <strong>Title:</strong> {selectedRecruiter.title}
              <br />
              <strong>Company:</strong> {selectedRecruiter.companyName}
              <br />
              <strong>Industry:</strong> {selectedRecruiter.industryType[0]}
              <br />
              <strong>Email:</strong> {selectedRecruiter.email}
              <br />
              <strong>Mobile:</strong> {selectedRecruiter.mobile}
              <br />
              <strong>Gender:</strong> {selectedRecruiter.gender}
              <br />
              <strong>Education:</strong> {selectedRecruiter.education}
            </div>
          </Card>
        )}
      </Dialog>
    </div>
  );
};

export default RecruiterRequests;
