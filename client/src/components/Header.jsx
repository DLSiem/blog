import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Simulated Loading State
const LoadingSpinner = () => (
  <div className="animate-spin h-6 w-6 border-4 border-t-transparent border-white rounded-full"></div>
);

const Header = () => {
  const { state, logout } = useAuth();
  const isAuth = state.isAuthenticated;
  const user = state.user;

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulating loading effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400); // 1.4 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/" className="hover:underline">
          My Blog
        </Link>
      </h1>

      {/* Navigation Links */}
      <nav>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ul className="flex space-x-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Home
              </NavLink>
            </li>
            {isAuth && (
              <>
                <li>
                  <NavLink
                    to={`/profile/${user?._id}`}
                    className={({ isActive }) =>
                      isActive ? "underline" : "hover:underline"
                    }
                  >
                    {user ? user.username : "Profile"}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/create"
                    className={({ isActive }) =>
                      isActive ? "underline" : "hover:underline"
                    }
                  >
                    Create
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>

      {/* Authentication Buttons */}
      {loading ? (
        <LoadingSpinner />
      ) : isAuth ? (
        <div className="space-x-4">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 py-1 bg-red-700 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <NavLink
            to="/auth/login"
            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-blue-100 transition duration-300"
          >
            Login
          </NavLink>
          <NavLink
            to="/auth/signup"
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-400 transition duration-300"
          >
            Signup
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
