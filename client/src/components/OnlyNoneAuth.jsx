import { useEffect, useState } from "react";
import { isAuthenticated } from "../actions/authActions";
import { Navigate } from "react-router-dom";
import propTypes from "prop-types";

const OnlyNoneAuth = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 mt-40">
          {/* Loading spinner */}
          <div className="h-16 w-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          {/* Fade-in loading text */}
          <p className="text-blue-600 text-lg font-semibold animate-pulse">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return children;
};

OnlyNoneAuth.propTypes = {
  children: propTypes.node.isRequired,
};

export default OnlyNoneAuth;
