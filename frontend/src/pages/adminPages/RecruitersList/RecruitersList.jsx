import { useEffect, useState } from "react";
import { Button, Modal, Table, Form as BootstrapForm } from "react-bootstrap";
import { Paginator } from "primereact/paginator";
import { toast } from "react-toastify";
import AdminNavbar from "../../../components/adminComponents/Navbar/adminNavbar.jsx";
import "../table.css";
import { PROFILE_PATH } from "../../../Utils/URL.js";

import {
  useAdminGetRecruitersMutation,
  useAdminBlockRecruiterMutation,
  useAdminUnblockRecruiterMutation,
} from "../../../redux/adminSlices/adminApiSlice.js";

const RecruitersList = () => {
  const [userData, setUserData] = useState([]);

  const [isBlocking, setIsblocking] = useState(false);
  const [isUnBlocking, setIsunblocking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const [AdminGetRecruiters] = useAdminGetRecruitersMutation();
  const [AdminBlockRecruiter] = useAdminBlockRecruiterMutation();
  const [AdminUnblockRecruiter] = useAdminUnblockRecruiterMutation();

  const fetchData = async () => {
    const responseFromApiCall = await AdminGetRecruiters();

    const userArray = responseFromApiCall.data.data;

    setUserData(userArray);
  };
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = userData.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const onPaginationChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleBlock = async (recruiterId) => {
    try {
      setIsblocking(true);
      const responseFromApiCall = await AdminBlockRecruiter({ recruiterId });

      console.log("Block API Response:", responseFromApiCall);

      if (responseFromApiCall.data.success) {
        setIsblocking(false);
        toast.success("Block successful");
        setUserData((prevData) => {
          const updatedData = prevData.map((user) =>
            user._id === recruiterId ? { ...user, isBlocked: true } : user
          );
          return updatedData;
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  const handleUnblock = async (recruiterId) => {
    try {
      setIsunblocking(true);
      const responseFromApiCall = await AdminUnblockRecruiter({ recruiterId });

      console.log("Unblock API Response:", responseFromApiCall);

      if (responseFromApiCall.data.success) {
        setIsunblocking(false);
        toast.success("unblocked successfully.");
        // Update the guideData state to reflect the change in the UI
        setUserData((prevData) => {
          const updatedData = prevData.map((user) =>
            user._id === recruiterId ? { ...user, isBlocked: false } : user
          );

          return updatedData;
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <>
      <AdminNavbar></AdminNavbar>
      {userData.length > 0 ? (
        <>
          <div style={{ marginTop: "100px" }}>
            <h3 className="Heading">User Management</h3>
          </div>
          <div className="Table">
            <BootstrapForm className="d-flex align-items-center justify-content-end pb-4">
              <BootstrapForm.Group
                className="mt-3"
                controlId="exampleForm.ControlInput1"
              >
                <BootstrapForm.Control
                  style={{ width: "auto" }}
                  value={searchQuery}
                  type="text"
                  placeholder="Enter Name or email........"
                  onChange={handleSearch}
                />
              </BootstrapForm.Group>
            </BootstrapForm>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Profile image</th>
                  <th> Name</th>

                  <th>Email</th>

                  <th>Title</th>

                  <th>Industry</th>

                  <th>Block</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(first, first + rows).map((user, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          user.profileImg
                            ? PROFILE_PATH + user.profileImg
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz_hPrEDS3XE8LQIEQRNSSMzc8IryJhz_iXQ&usqp=CAU"
                        }
                        alt={`recruiter ${index}`}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          overflow: "hidden",
                        }}
                      />
                    </td>
                    <td>{user.userName}</td>

                    <td>{user.email}</td>
                    <td>{user.title}</td>
                    <td>{user.industryType[0]}</td>

                    <td>
                      <Button
                        type="button"
                        variant={user.isBlocked ? "success" : "warning"}
                        className="mt-1"
                        disabled={isBlocking || isUnBlocking} // Disable the button during API calls
                        onClick={() => {
                          if (user.isBlocked) {
                            // Unblock the user
                            handleUnblock(user._id);
                          } else {
                            // Block the user
                            handleBlock(user._id);
                          }
                        }}
                      >
                        {isBlocking || isUnBlocking
                          ? "Processing..."
                          : user.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginator
              first={first}
              rows={rows}
              totalRecords={filteredUsers.length}
              onPageChange={onPaginationChange}
            />
          </div>
        </>
      ) : (
        <div className="Table text-center" style={{ marginTop: "150px" }}>
          <h4>No users..</h4>
        </div>
      )}
    </>
  );
};

export default RecruitersList;
