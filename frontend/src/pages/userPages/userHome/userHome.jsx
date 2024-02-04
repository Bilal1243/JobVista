import React from "react";
import NavbarUi from "../../../components/Navbars/Navbar";
import Banner from "../../../components/Banner/Banner";
import PostsContainer from "../../../components/PostListing/PostsContainer";
import { useSelector } from "react-redux";
function userHome() {
  const { userData } = useSelector((state) => state.auth);

  return (
    <>
      <NavbarUi></NavbarUi>
      <Banner></Banner>
      {userData && <PostsContainer></PostsContainer>}
    </>
  );
}

export default userHome;
