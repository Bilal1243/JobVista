import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "../redux/userSlices/userAuthSlice";
import { useGetProfileMutation } from "../redux/userSlices/userApiSlice";

const UserPrivateRoute = ({ element }) => {
  const { userData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [getProfile] = useGetProfileMutation();

  useEffect(() => {
    if (userData) {
      isBlocked();
    }
  }, []);

  const isBlocked = async () => {
    try {
      const responseData = await getProfile({ userId: userData._id }).unwrap();
      if (responseData.data.isBlocked) {
        dispatch(logout());
      }
    } catch (error) {
      console.log(error?.data || error?.data?.message);
    }
  };

  return userData ? element : <Navigate to="/login" />;
};
export default UserPrivateRoute;
