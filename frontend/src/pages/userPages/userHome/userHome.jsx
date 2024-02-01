import React from 'react'
import NavbarUi from '../../../components/Navbars/Navbar'
import Banner from '../../../components/Banner/Banner'
import PostsContainer from '../../../components/PostListing/PostsContainer'
function userHome() {
  return (
    <>
    <NavbarUi></NavbarUi>
    <Banner></Banner>
    <PostsContainer></PostsContainer>
    </>
  )
}

export default userHome
