import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NetworkCard.css";
import { useSelector } from "react-redux";
import { PROFILE_PATH } from "../../Utils/URL";
import defualtProfile from "../../assets/defualtProfile.jpg";
import { Button } from "primereact/button";
import { useUserConnectMutation } from "../../redux/userSlices/userApiSlice";

function NetworkCard({ users }) {
  const { userData } = useSelector((state) => state.auth);

  const [userConnect] = useUserConnectMutation()

  const ConnectUser = async(connectId)=>{
    try {
      const responseData = await userConnect({connectId,userId : userData._id}).unwrap()
    
    } catch (error) {
      console.log(error?.data?.message || error?.message)
    }
  }

  return (
    <>
      <div class="container page-container" style={{ marginTop: "150px" }}>
        <div class="row gutters">
          {users.map((user, index) => (
            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4">
              <figure class="user-card green">
                <figcaption>
                  <img
                    src={
                      user.profileImg
                        ? PROFILE_PATH + user.profileImg
                        : defualtProfile
                    }
                    alt="profile image"
                    class="profile"
                  />
                  <h5>
                    {user.firstName} {user.lastName}
                  </h5>
                  <h6>{user.title}</h6>
                  <p>0 Connection</p>
                  <div class="clearfix">
                    <Button
                      type="button"
                      label="Connect"
                      icon="pi pi-user-plus"
                      outlined
                      onClick={()=>ConnectUser(user._id)}
                    />
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default NetworkCard;
