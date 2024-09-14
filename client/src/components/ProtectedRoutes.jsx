import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

import propTypes from "prop-types";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const isAuth = state.isAuthenticated;
  const loading = state.loading;

  if (loading) {
    return (
      <div className="flex mt-10 flex-col justify-center items-center bg-gray-100">
        {/* Loading Spinner */}
        <div className="mb-4">
          <div className="animate-spin rounded-full h-20 w-20 border-t-transparent border-8 border-blue-500  "></div>
        </div>
        {/* Fade-in Loading Text */}
        <p className="text-gray-600 text-xl font-medium animate-pulse mb-8">
          Loading, please wait...
        </p>
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  } else if (!isAuth && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        {/* Main message */}
        <p className="text-red-500 text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
          You are not authorized to view this page
        </p>

        {/* Login and Signup buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center py-8 space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
          <Link
            to="/auth/login"
            className="px-6 py-3 bg-blue-600 text-center text-white font-semibold rounded-md shadow-md transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="px-6 py-3 bg-green-600 text-center text-white font-semibold rounded-md shadow-md transition-all duration-300 ease-in-out hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto"
          >
            Sign Up
          </Link>
        </div>

        {/* Optional Illustration or Icon */}
        <div className="mt-8">
          <img
            src="/icon/unauthorized.png" // Replace with actual illustration URL
            alt="Unauthorized access"
            className="w-56 mx-auto"
          />
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
