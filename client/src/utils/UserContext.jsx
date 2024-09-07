import { createContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import { isAuthenticated } from "../actions/authActions";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  UserProvider.propTypes = {
    children: propTypes.node.isRequired,
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //

  const fetchUserData = async () => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { data } = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
