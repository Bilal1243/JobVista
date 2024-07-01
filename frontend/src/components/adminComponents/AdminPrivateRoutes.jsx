import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminPrivateRoute = ({ element }) => {
  const { adminData } = useSelector((state) => state.adminAuth)
  return adminData ? element : <Navigate to="/adminLogin" />
}
export default AdminPrivateRoute