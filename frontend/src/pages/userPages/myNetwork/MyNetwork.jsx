import React, { useEffect, useState } from "react";
import NetworkCard from "../../../components/NetworkCard/NetworkCard";
import NavbarUi from "../../../components/Navbars/Navbar";
import { useUserlistMyNetworkMutation } from "../../../redux/userSlices/userApiSlice";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";

function MyNetwork() {
  const { userData } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [requests, setRequests] = useState([]);

  const [userlistMyNetwork] = useUserlistMyNetworkMutation();

  const fetchUsers = async () => {
    try {
      const responseData = await userlistMyNetwork({
        userId: userData._id,
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
      <NavbarUi></NavbarUi>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <NetworkCard
          users={users}
          requests={requests}
          reFetchusers={reFetchusers}
        ></NetworkCard>
      )}
    </>
  );
}

export default MyNetwork;
