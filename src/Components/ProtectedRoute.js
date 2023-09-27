import { useRouter } from "next/navigation"
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUserData } from "@/store/features/userSlice";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch()
  // Your condition for redirection
  const token = Cookies.get('jwt_token')
  if (!token) {
    router.push("/login");
    return null; // You can return null to prevent rendering the component
  }

  const userDataJson = localStorage.getItem('userData')
  if(userDataJson){
  const userData = JSON.parse(userDataJson)
  dispatch(addUserData(userData))
  }else{
    router.replace('/login');
  }
  // Render the children (component or content) if the condition is not met
  return <>{children}</>;
};

export default ProtectedRoute;


