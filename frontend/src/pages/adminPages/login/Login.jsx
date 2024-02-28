import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../../assets/JobVista.png'

import { setCredentials } from '../../../redux/adminSlices/adminAuthSlice'
import { useAdminloginMutation } from '../../../redux/adminSlices/adminApiSlice'

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
} from 'mdb-react-ui-kit'
import { toast } from 'react-toastify'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { adminData } = useSelector((state) => state.adminAuth)
  const [Adminlogin] = useAdminloginMutation()

  useEffect(()=>{
    if(adminData){
      navigate('/adminHome')
    }
  },[])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const responseFromApiCall = await Adminlogin({
        email,
        password,
      }).unwrap()
      console.log(responseFromApiCall)

      dispatch(setCredentials({ ...responseFromApiCall }))
      console.log(adminData)
      navigate('/adminHome')
    } catch (err) {
      toast.error(err?.data?.message || err?.message)
    }
  }

  return (
    <div style={{ backgroundColor: '#fffff' }}>
      <div
        style={{
          backgroundImage: 'url("./https://img.freepik.com/free-photo/background_53876-32169.jpg")', // Replace with the URL of your background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div></div>
        <div>
          <div>
            <img
              src={logo} // Use the imported variable
              alt="Logo"
              style={{
                width: 'auto',
                height: '150px',
                margin: '0 auto',
                display: 'block',
              }} // Adjust the width and height as needed
            />
          </div>
          <h3
            style={{
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
              display: 'block',
              fontFamily: 'Poppins',
              paddingLeft: '20px',
            }}
          >
            Welcome Back Admin
          </h3>

          <MDBCard
            alignment=""
            className="mb-1 character"
          >

            <MDBCardBody>
              <MDBValidation
                onSubmit={submitHandler}
                noValidate
                className="row g-3"
              >
                <div className="col-md-12">
                    <MDBInput
                      label="Email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      validation="Please provide your email"
                      invalid
                    />
                </div>
                <div className="col-md-12">
                    <MDBInput
                      label="Password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                </div>
                <div className="col-12 d-flex align-items-center justify-content-center">
                  <MDBBtn
                    style={{
                      width: '50%',
                      borderRadius: '50px',
                      backgroundColor: 'black',
                      color: 'white',
                    }}
                    className="mt-3"
                  >
                    Login
                  </MDBBtn>
                </div>
              </MDBValidation>
            </MDBCardBody>
            <p style={{ textAlign: 'center' }}></p>
           
          </MDBCard>
        </div>
      </div>
      
    </div>
  )
}

export default LoginScreen