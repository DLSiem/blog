import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <h1 className="text-xl font-bold">My Blog Website</h1>
      <nav className="mt-2">
        <ul className="flex space-x-4">
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
    </header>
  );
};

export default Header;
