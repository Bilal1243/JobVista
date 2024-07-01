import React, { useEffect, useState } from "react";
import NavbarUi from "../../../components/Navbars/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserConnections.css";
import { useUserListConnectionsMutation } from "../../../redux/userSlices/userApiSlice";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { PROFILE_PATH } from "../../../Utils/URL";
import defualtProfile from "../../../assets/defualtProfile.jpg";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";

function UserConnections() {
  const { userData } = useSelector((state) => state.auth);

  const [connections, setConnections] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5); // Number of rows per page

  const [userListConnections] = useUserListConnectionsMutation();

  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const connectionsData = await userListConnections({
        userId: userData._id,
      }).unwrap();
      setConnections(connectionsData);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const handleSearching = (e) => {
    setSearchText(e);
    setFirst(0); // Reset first to the first page when searching
  };

  const filteredConnections = connections.filter((connection) => {
    const fullName = `${connection.user[0].firstName} ${connection.user[0].lastName}`;
    return fullName.toLowerCase().includes(searchText.toLowerCase());
  });

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <>
      <NavbarUi />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div className="container" style={{ marginTop: "150px" }}>
        <div className="card">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <Button onClick={() => navigate("/profile")}>Go Back</Button>
            </div>
            <div>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  placeholder="Search by name"
                  value={searchText}
                  onChange={(e) => handleSearching(e.target.value)}
                />
              </span>
            </div>
          </div>
        </div>
        <div className="card p-3">
          <h5>{filteredConnections.length} connections</h5>
          {filteredConnections
            .slice(first, first + rows)
            .map((connection, index) => (
              <div className="card" key={index}>
                <div className="card-body p-3 d-flex justify-content-between align-items-center">
                  <div
                    className="inner-body d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/visitProfile/${connection.user[0]._id}`)}
                  >
                    <img
                      src={
                        connection.user[0].profileImg
                          ? PROFILE_PATH + connection.user[0].profileImg
                          : defualtProfile
                      }
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="user-details ml-3">
                      <h6 className="mb-1">
                        {connection.user[0].firstName}{" "}
                        {connection.user[0].lastName}
                      </h6>
                      <p className="mb-0">{connection.user[0].title}</p>
                    </div>
                  </div>
                  <div className="buttons">
                    <Button label="Message" outlined />
                  </div>
                </div>
              </div>
            ))}
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredConnections.length}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}

export default UserConnections;
