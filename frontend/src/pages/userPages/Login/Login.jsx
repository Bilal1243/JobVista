import React, { useEffect, useState } from 'react'
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBValidation
}
    from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import loginBg from '../../../assets/login-bg.png'; // Import the image
import logo from '../../../assets/jobVista.png'; // Import the image
import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../redux/userSlices/userApiSlice';
import { setCredentials } from '../../../redux/userSlices/userAuthSlice'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify'

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.auth)

    const [login] = useLoginMutation()

    useEffect(()=>{
        if(userData){
            navigate('/')
        }
    },[])

    const submitHandler = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Both email and password are required.')
        } else {
            try {
                const responseFromApiCall = await login({ email, password }).unwrap()
                if (responseFromApiCall) {
                    dispatch(setCredentials({ ...responseFromApiCall }))
                    toast.success('Login Sucessfull')
                    navigate('/')
                } else {
                    toast.error('no details found')
                }
            } catch (err) {
                if (err.data && err.data.message) {
                    toast.error(err.data.message)
                } else {
                    toast.error('An error occurred. Please try again.')
                }
            }
        }
    }

    return (
        <>
            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='6'>

                        <div className='d-flex flex-column justify-content-center h-custom-2 w-75 mt-l-0 mt-3'>
                            <div className='d-flex flex-row ps-l-5 ps-0 align-items-center justify-content-center'>
                                <span className="h1 fw-bold mb-3"><img src={logo} style={{ width: '150px', height: '100px' }}></img></span>
                            </div>
                            <MDBValidation
                                onSubmit={submitHandler}
                                noValidate
                                className="row g-1"
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
                                            wrapperClass='mb-4 mx-l-5 mx-0 w-100'
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
                                            wrapperClass='mb-4 mx-l-5 mx-0 w-100'
                                        />
                                </div>
                                <MDBBtn className="mb-4 px-5 mx-l-5 mx-0 w-100" color='info' size='lg' style={{ color: 'white' }}>Login</MDBBtn>
                            </MDBValidation>
                            <p className="small mb-2 pb-lg-3 ms-l-5 ms-0"><a className="text-muted">Forgot password?</a></p>
                            <Link to='/signup'>
                                <p className='ms-l-5 ms-0'>Don't have an account? <span className='link-info'>Register here</span></p>
                            </Link>
                            <Link to='/recruiterRegister'>
                                <p className='ms-l-5 ms-0'>Are you a recruiter? <span className='link-info'>Register here</span></p>
                            </Link>

                        </div>

                    </MDBCol>

                    <MDBCol sm='6' className='d-none d-sm-block px-0'>
                        <img src={loginBg}
                            alt="Login image" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
        </>
    )
}

export default Login
