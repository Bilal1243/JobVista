import React, { useState } from "react";
import {
  useUserChangePasswordMutation,
  useUserLogoutMutation,
} from "../../../redux/userSlices/userApiSlice";
import { toast } from "react-toastify";
import { logout } from "../../../redux/userSlices/userAuthSlice";
import { useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux'

function Settings({ activeTab }) {
  const [CurrPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [userChangePassword] = useUserChangePasswordMutation();
  const [userLogout] = useUserLogoutMutation();

  const handleChangePassword = async () => {
    try {
      if (newPassword.trim() === "" || !newPassword) {
        toast.error("password must be valid");
      } else if (newPassword.length <= 7) {
        toast.error("password must be greater than 7 characters");
      } else if (confirmNewPass !== newPassword) {
        toast.error("new password is not matching with confirm password");
      } else {
        const response = await userChangePassword({
          newPass: newPassword,
          oldPass: CurrPassword,
        }).unwrap();
        if (response.success) {
          toast.success(response.message);
          setConfirmNewPass('')
          setNewPassword('')
          setCurrentPassword('')
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  const logoutUser = async () => {
    try {
      await userLogout().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  return (
    <>
      <div
        className={`tab-pane ${activeTab === "settings" ? "active" : ""}`}
        id="settings"
      >
        <h6>ACCOUNT SETTINGS</h6>
        <hr />
        <form>
          <div class="form-group">
            <label for="username" className="mb-2">
              Change Password
            </label>
            <div className="form-group mb-2">
              <input
                type="password"
                class="form-control"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter old password"
                value={CurrPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                class="form-control"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                class="form-control"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Confirm new password"
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success"
                type="button"
                onClick={() => handleChangePassword()}
              >
                change password
              </button>
            </div>
          </div>
          <hr />
          <button
            class="btn btn-danger"
            type="button"
            onClick={() => logoutUser()}
          >
            Logout
          </button>
        </form>
      </div>
    </>
  );
}

export default Settings;
