import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

import propTypes from "prop-types";

const ProtectedRoutes = ({ children }) => {
  const { state } = useAuth();
  const isAuth = state.isAuthenticated;
  const loading = state.loading;

  if (loading) {
    if (!isAuth) {
      return (
        <div className="items-center">
          <p className="text-red-500 text-2xl font-semibold">
            You are not authorized to view this page
          </p>

          {/* login and signup button */}
          <div className="flex w-full">
            <div className="m-2">
              <Link
                to="/auth/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Login
              </Link>
            </div>
            <div className="m-2">
              <Link
                to="/auth/signup"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      );
    }

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
  return children;
};

ProtectedRoutes.propTypes = {
  children: propTypes.node.isRequired,
};

export default ProtectedRoutes;
