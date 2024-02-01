import React from 'react'
import { useSelector } from 'react-redux'
import RecruiterNavbar from '../../../components/recruiterComponents/Navbar/RecruiterNavbar'

function RecruiterHome() {

    const {recruiterData} = useSelector((state)=>state.recruiterAuth)

  return (
    <div>
      <RecruiterNavbar></RecruiterNavbar>
    </div>
  )
}

export default RecruiterHome
