import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// export as default

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
