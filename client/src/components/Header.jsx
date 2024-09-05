import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Blog Website</h1>
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
          <li>
            <NavLink
              to="profile"
              className={({ isActive }) => {
                return isActive ? "underline" : "hover:underline";
              }}
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
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
    </header>
  );
};

export default Header;
