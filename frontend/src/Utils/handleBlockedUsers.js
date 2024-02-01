import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlices/userAuthSlice";

const handleBlockedUser = async (response, dispatch) => {
  if (response?.error?.data?.message === 'User is blocked') {
    console.log("User is blocked. Logging out...");

    // Use the logout action directly within the component
    dispatch(logout());
  }
};

export default handleBlockedUser