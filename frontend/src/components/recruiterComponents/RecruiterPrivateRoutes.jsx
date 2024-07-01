import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RecruiterPrivateRoutes = ({ element }) => {
  const { recruiterData } = useSelector((state) => state.recruiterAuth)
  return recruiterData ? element : <Navigate to='/recruiterLogin'></Navigate>
}
export default RecruiterPrivateRoutes