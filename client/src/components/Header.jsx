import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { state, logout } = useAuth();
  const isAuth = state.isAuthenticated;
  const user = state.user;
  console.log("isAuth:-", isAuth);
  console.log("user:-", user);
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Blog </h1>
      <nav className="mt-2">
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => {
                return isActive ? "underline" : "hover:underline";
              }}
            >
              Home
            </NavLink>
          </li>
          {isAuth && (
            <li>
              <NavLink
                to="profile"
                className={({ isActive }) => {
                  return isActive ? "underline" : "hover:underline";
                }}
              >
                {user ? user.username : "Profile"}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      {isAuth ? (
        <div className="space-x-4">
          <button
            onClick={() => {
              console.log("Logout");
              logout();
            }}
            className="px-4 py-1 bg-red-700 text-white font-semibold rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <NavLink
            to="/auth/login"
            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-blue-100"
          >
            Login
          </NavLink>
          <NavLink
            to="/auth/signup"
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-400"
          >
            Signup
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
