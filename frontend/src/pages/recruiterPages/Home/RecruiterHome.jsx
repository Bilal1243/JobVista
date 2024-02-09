import React from 'react'
import { useSelector } from 'react-redux'
import RecruiterNavbar from '../../../components/recruiterComponents/Navbar/RecruiterNavbar'
import PostsContainer from '../../../components/recruiterComponents/PostListing/PostsContainer'

function RecruiterHome() {

    const {recruiterData} = useSelector((state)=>state.recruiterAuth)

  return (
    <div>
      <RecruiterNavbar></RecruiterNavbar>
      <PostsContainer></PostsContainer>
    </div>
  )
}

export default RecruiterHome
