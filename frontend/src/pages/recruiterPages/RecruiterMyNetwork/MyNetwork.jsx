import React, { useEffect, useState } from "react";
import { useRecruiterlistMyNetworkMutation } from "../../../redux/recruiterSlices/recruiterApiSlices";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import RecruiterNetworkCard from "../../../components/recruiterComponents/RecruiterNetwork/NetworkCard";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar";

function RecruiterNetwork() {
  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  const [recruiterlistMyNetwork] = useRecruiterlistMyNetworkMutation();

  const fetchUsers = async () => {
    try {
      const responseData = await recruiterlistMyNetwork({
        userId: recruiterData._id,
      }).unwrap();
      setUsers(responseData.result);
      setRequests(responseData.requests);
      setIsloading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const reFetchusers = () => {
    fetchUsers();
  };

  return (
    <>
      <RecruiterNavbar></RecruiterNavbar>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <RecruiterNetworkCard
          users={users}
          requests={requests}
          reFetchusers={reFetchusers}
        ></RecruiterNetworkCard>
      )}
    </>
  );
}

export default RecruiterNetwork;
