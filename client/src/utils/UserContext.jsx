import { createContext, useEffect, useState } from "react";
import propTypes from "prop-types";

export const UserContext = createContext();

// const isAuthen = isAuthenticated();

export const UserProvider = ({ children }) => {
  UserProvider.propTypes = {
    children: propTypes.node.isRequired,
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [isAuth, setIsAuth] = useState(false);

  // initialsize isAuthentication function

  const fetchUserData = async () => {
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
    <UserContext.Provider value={{ user, loading, setUser, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};
