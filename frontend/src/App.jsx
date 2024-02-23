import { react } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import UserHome from './pages/userPages/userHome/userHome.jsx'
import Login from './pages/userPages/Login/Login.jsx'
import Register from './pages/userPages/register/Register.jsx'
import JobPreference from './pages/userPages/Jobpreference&Skills/JobPreference/JobPreference.jsx'
import SkillUi from './pages/userPages/Jobpreference&Skills/Skills.jsx'
import UserPrivateRoute from './components/UserprivateRoutes.jsx'
import Profile from './pages/userPages/Profile/Profile.jsx'
import JobListing from './pages/userPages/Jobs/JobListing.jsx'
import ViewJob from './pages/userPages/Jobs/ViewJob.jsx'
import JobApply from './pages/userPages/JobApply/JobApply.jsx'
import SuccessPage from './pages/userPages/JobApply/SuccessPage.jsx'
import MyNetwork from './pages/userPages/myNetwork/MyNetwork.jsx'
import UserConnections from './pages/userPages/ConnectionList/UserConnections.jsx'
import UserProfileVisit from './pages/userPages/UserProfileVisit/UserProfileVisit.jsx'
import UserChat from './pages/userPages/UserChat/UserChat.jsx'
import AddDetails from './pages/userPages/register/AddDetails.jsx'
import ForgotPassword from './pages/userPages/ForgotPass/ForgotPassword.jsx'
import VerifyOtp from './pages/userPages/ForgotPass/VerifyOtp.jsx'
import ChangePassword from './pages/userPages/ForgotPass/ChangePassword.jsx'




import AdminPriveRoute from './components/adminComponents/AdminPrivateRoutes.jsx'
import AdminDashboard from './pages/adminPages/AdminHome/adminDashboard.jsx'
import LoginScreen from './pages/adminPages/login/Login.jsx'
import Industry from './pages/adminPages/IndustryPage/Industry.jsx'
import Skills from './pages/adminPages/SkillsPage/Skills.jsx'
import RecruiterRequests from './pages/adminPages/Recruiter_Requests/RecruiterRequests.jsx'
import UserList from './pages/adminPages/UserList/UserList.jsx'
import JobRequests from  './pages/adminPages/jobRequests/JobRequests.jsx'
import RecruitersList from './pages/adminPages/RecruitersList/RecruitersList.jsx'


import RecruiterPrivateRoutes from './components/recruiterComponents/RecruiterPrivateRoutes.jsx'
import RecruiterRegister from './pages/recruiterPages/Register/RecruiterRegister.jsx'
import RecruiterLogin from './pages/recruiterPages/Login/RecruiterLogin.jsx'
import RecruiterHome from './pages/recruiterPages/Home/RecruiterHome.jsx'
import MyJobs from './pages/recruiterPages/My_Jobs/MyJobs.jsx'
import ListApplicants from './pages/recruiterPages/ListApplicants/ListApplicants.jsx'
import RecruiterProfile from './pages/recruiterPages/Profile/Profile.jsx'
import PostJob from './pages/recruiterPages/postJob/PostJob.jsx'
import RecruiterNetwork from './pages/recruiterPages/RecruiterMyNetwork/MyNetwork.jsx'
import RecruiterConnetions from './pages/recruiterPages/ConnectionList/RecruiterConnections.jsx'
import RecruiterChat from './pages/recruiterPages/RecruiterChat/RecruiterChat.jsx'
import RecruiterProfileVisit from './pages/recruiterPages/RecruiterProfileVisit/RecruiterProfileVisit.jsx'
import RecruiterForgotPassword from './pages/recruiterPages/ForgotPass/RecruiterForgotPassword.jsx'
import RecruiterChangePassword from './pages/recruiterPages/ForgotPass/RecruiterChangePassword.jsx'
import RecruiterVerifyOtp from './pages/recruiterPages/ForgotPass/RecruiterVerifyOtp.jsx'

function App() {
 
  return (
    <>
      <ToastContainer
        position="top-right"
        transition={Zoom}
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path='/' element={<UserHome></UserHome>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Register></Register>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path='/otp' element={<VerifyOtp></VerifyOtp>}></Route>
        <Route path='/changePassword' element={<ChangePassword></ChangePassword>}></Route>
        <Route path='/addDetails/:id' element={<AddDetails></AddDetails>}></Route>
        <Route path='/jobPreference/:id' element={<JobPreference></JobPreference>}></Route>
        <Route path='/addSkills/:id' element={<SkillUi></SkillUi>}></Route>
        <Route path='/jobs' element={<UserPrivateRoute element={<JobListing></JobListing>}></UserPrivateRoute>}></Route>
        <Route path='/profile' element={<UserPrivateRoute element={<Profile></Profile>}></UserPrivateRoute>}></Route>
        <Route path='/viewJob/:jobId' element={<UserPrivateRoute element={<ViewJob></ViewJob>}></UserPrivateRoute>}></Route>
        <Route path='/applyJob/:jobId' element={<UserPrivateRoute element={<JobApply></JobApply>}></UserPrivateRoute>}></Route>
        <Route path='/applied/:jobId' element={<UserPrivateRoute element={<SuccessPage></SuccessPage>}></UserPrivateRoute>}></Route>
        <Route path='/MyNetwork' element={<UserPrivateRoute element={<MyNetwork></MyNetwork>}></UserPrivateRoute>}></Route>
        <Route path='/connections' element={<UserPrivateRoute element={<UserConnections></UserConnections>}></UserPrivateRoute>}></Route>
        <Route path='/visitProfile/:id' element={<UserPrivateRoute element={<UserProfileVisit></UserProfileVisit>}></UserPrivateRoute>}></Route>
        <Route path='/messages' element={<UserPrivateRoute element={<UserChat></UserChat>}></UserPrivateRoute>}></Route>



        {/* admin routes */}

        <Route path='/adminLogin' element={<LoginScreen></LoginScreen>}></Route>
        <Route path='/adminHome' element={<AdminPriveRoute element={<AdminDashboard></AdminDashboard>}></AdminPriveRoute>}></Route>
        <Route path='/adminindustryTypes' element={<AdminPriveRoute element={<Industry></Industry>}></AdminPriveRoute>}></Route>
        <Route path='/skills' element={<AdminPriveRoute element={<Skills></Skills>}></AdminPriveRoute>}></Route>
        <Route path='/admin-recruiter-Requests' element={<AdminPriveRoute element={<RecruiterRequests></RecruiterRequests>}></AdminPriveRoute>}></Route>
        <Route path='/userList' element={<AdminPriveRoute element={<UserList></UserList>}></AdminPriveRoute>}></Route>
        <Route path='/job-requests' element={<AdminPriveRoute element={<JobRequests></JobRequests>}></AdminPriveRoute>}></Route>
        <Route path='/recruiterListData' element={<AdminPriveRoute element={<RecruitersList></RecruitersList>}></AdminPriveRoute>}></Route>



        {/* Recruiter Routes */}

        <Route path='/recruiterRegister' element={<RecruiterRegister></RecruiterRegister>}></Route>
        <Route path='/recruiterLogin' element={<RecruiterLogin></RecruiterLogin>}></Route>
        <Route path='/recruiterForgotPass' element={<RecruiterForgotPassword></RecruiterForgotPassword>}></Route>
        <Route path='/RecruiterOtp' element={<RecruiterVerifyOtp></RecruiterVerifyOtp>}></Route>
        <Route path='/recruiterChangePassword' element={<RecruiterChangePassword></RecruiterChangePassword>}></Route>
        <Route path='/recruiter' element={<RecruiterPrivateRoutes element={<RecruiterHome></RecruiterHome>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/myJobs' element={<RecruiterPrivateRoutes element={<MyJobs></MyJobs>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/createJob' element={<RecruiterPrivateRoutes element={<PostJob></PostJob>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/Recruiter-Profile' element={<RecruiterPrivateRoutes element={<RecruiterProfile></RecruiterProfile>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/viewApplications/:jobId' element={<RecruiterPrivateRoutes element={<ListApplicants></ListApplicants>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/Recruiter-Network' element={<RecruiterPrivateRoutes element={<RecruiterNetwork></RecruiterNetwork>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/recruiter-connections' element={<RecruiterPrivateRoutes element={<RecruiterConnetions></RecruiterConnetions>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/Recruiter-Messages' element={<RecruiterPrivateRoutes element={<RecruiterChat></RecruiterChat>}></RecruiterPrivateRoutes>}></Route>
        <Route path='/visitsprofile/:id' element={<RecruiterPrivateRoutes element={<RecruiterProfileVisit></RecruiterProfileVisit>}></RecruiterPrivateRoutes>}></Route>

      </Routes>
    </>
  )
}

export default App
