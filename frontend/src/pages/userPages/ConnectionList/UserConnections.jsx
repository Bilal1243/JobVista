import React, { useEffect, useState } from "react";
import NavbarUi from "../../../components/Navbars/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserConnections.css";
import { useUserListConnectionsMutation } from "../../../redux/userSlices/userApiSlice";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

function UserConnections() {
  const { userData } = useSelector((state) => state.auth);

  const [connections, SetConnections] = useState([]);

  const [userListConnections] = useUserListConnectionsMutation();

  const navigate = useNavigate()

  const fetchConnections = async () => {
    try {
      const connections = await userListConnections({
        userId: userData._id,
      }).unwrap();
      SetConnections(connections);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <>
      <NavbarUi></NavbarUi>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div class="container" style={{ marginTop: "150px" }}>
        <Button onClick={()=>navigate('/profile')}>Go Back</Button>
        <div className="card p-3">
          {connections.map((connection, index) => (
            <div className="card" key={index}>
              <div className="card-body">{connection.user[0].firstName}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserConnections;
