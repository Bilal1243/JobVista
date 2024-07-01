import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NetworkCard.css";
import { useSelector } from "react-redux";
import { PROFILE_PATH } from "../../../Utils/URL";
import defualtProfile from "../../../assets/defualtProfile.jpg";
import { Button } from "primereact/button";
import {
  useRecruiterConnectMutation,
  useRecruiterAcceptRequestMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function RecruiterNetworkCard({ users, requests, reFetchusers }) {
  const { recruiterData } = useSelector((state) => state.recruiterAuth);
  const [pendingUsers, setPendingUsers] = useState([]);

  const [recruiterConnect] = useRecruiterConnectMutation();
  const [recruiterAcceptRequest] = useRecruiterAcceptRequestMutation();

  const navigate = useNavigate();

  const ConnectUser = async (connectId, index) => {
    try {
      const responseData = await recruiterConnect({
        connectId,
        userId: recruiterData._id,
      }).unwrap();
      if (responseData.success) {
        const updatedPendingUsers = [...pendingUsers, responseData.id];
        setPendingUsers(updatedPendingUsers);
      }
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const acceptUser = async (connectId) => {
    try {
      const response = await recruiterAcceptRequest({
        connectId,
        userId: recruiterData._id,
      }).unwrap();
      if (response.success) {
        toast.success("connection request accepted");
        reFetchusers();
      }
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };


  return (
    <>
      <div className="container page-container" style={{ marginTop: "150px" }}>
        <div className="request-list">
          <div className="request-header">
            <h5 className="mb-0">
              {requests.length > 0
                ? `Requests (${requests.length})`
                : "No Requests"}
            </h5>
          </div>
          <hr />
          <div className="request-items">
            {requests.map((request, index) => (
              <div
                className="request-item d-flex align-items-center justify-content-between"
                key={index}
              >
                <div className="user-info d-flex align-items-center">
                  <img
                    src={
                      request.user[0].profileImg
                        ? PROFILE_PATH + request.user[0].profileImg
                        : defualtProfile
                    }
                    alt=""
                    className="profile-image"
                  />
                  <div className="user-details ml-3">
                    <h6 className="mb-1">
                      {request.user[0].firstName} {request.user[0].lastName}
                    </h6>
                    <p className="mb-0">{request.user[0].title}</p>
                  </div>
                </div>
                <div>
                  <Button
                    label="Accept"
                    className="p-button-sm"
                    onClick={() => acceptUser(request.user[0]._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {users.length > 0 ? (
          <div className="row gutters mt-4 pt-3">
            <p>People you may know based on your recent activity</p>
            {users.map((user, index) => (
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6" key={index}>
                <figure className="user-card green">
                  <figcaption>
                    <div
                      onClick={() => navigate(`/visitsProfile/${user._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          user.profileImg
                            ? PROFILE_PATH + user.profileImg
                            : defualtProfile
                        }
                        alt="profile image"
                        className="profile"
                      />
                      <h5>
                        {user.firstName} {user.lastName}
                      </h5>
                      <h6>{user.title}</h6>
                    </div>
                    <div className="clearfix">
                      <Button
                        type="button"
                        label={
                          pendingUsers.includes(user._id)
                            ? "Pending"
                            : "Connect"
                        }
                        icon={
                          pendingUsers.includes(user._id)
                            ? "pi pi-clock"
                            : "pi pi-user-plus"
                        }
                        outlined
                        onClick={
                          pendingUsers.includes(user._id)
                            ? null
                            : () => ConnectUser(user._id, index)
                        }
                      />
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-3">No Users for you :(</p>
        )}
      </div>
    </>
  );
}

export default RecruiterNetworkCard;
