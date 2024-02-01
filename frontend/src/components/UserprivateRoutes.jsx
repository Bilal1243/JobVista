import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserPrivateRoute = ({ element }) => {
  const { userData } = useSelector((state) => state.auth)
  return userData ? element : <Navigate to="/login" />
}
export default UserPrivateRoute