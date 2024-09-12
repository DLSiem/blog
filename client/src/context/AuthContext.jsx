import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

// initial states

const initialStates = {
  isAuthenticated: false,
  user: null,
  error: false,
  loading: true,
  message: "",
};

// reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER": {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    }

    case "LOGIN_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
      };

    case "LOGIN": {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
      };
    }

    case "LOGIN_FAILURE": {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        error: true,
      };
    }

    case "SIGNUP_REQUEST": {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case "SIGNUP":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
      };

    case "SIGNUP_FAILURE": {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        error: true,
      };
    }

    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: true,
      };
    }

    case "TOKEN_VALID": {
      return {
        ...state,
        user: action.payload.data,
        isAuthenticated: true,
        loading: false,
      };
    }

    case "REFRESHING_TOKEN": {
      return {
        ...state,
        loading: true,
      };
    }

    default:
      return state;
  }
};

// create a context for the auth state
const AuthContext = createContext();

// create a provider for the auth context

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [state, dispatch] = useReducer(authReducer, initialStates);

  // validate token
  const isTokenValid = async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: "LOGOUT",
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/auth/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 401 && data.error === "TokenExpiredError") {
        dispatch({
          type: "REFRESHING_TOKEN",
        });
        const response = await refreshToken();

        if (response) {
          return true;
        } else {
          dispatch({
            type: "LOGOUT",
          });
          return;
        }
      }

      if (response.status === 200) {
        dispatch({
          type: "TOKEN_VALID",
          payload: data,
        });
        return;
      } else {
        dispatch({
          type: "LOGOUT",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "LOGOUT",
      });
      return;
    }
  };

  // refresh token
  const refreshToken = async () => {
    const response = await fetch("http://localhost:3000/auth/refreshtoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // send cookies
    });

    if (response.status === 200) {
      const res = await response.json();

      let { token, user } = res;
      const data = user;
      localStorage.setItem("token", token);

      dispatch({
        type: "TOKEN_VALID",
        payload: data,
      });
      return true;
    }
    return false;
  };

  // check if token is valid on load and refresh

  useEffect(() => {
    isTokenValid();
  }, []);

  // defining the login action
  const login = async (data) => {
    // dispatch login request
    const { email, password } = data;
    dispatch({
      type: "LOGIN_REQUEST",
    });

    try {
      // dispatch login success
      const resposne = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "login",
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await resposne.json();

      if (!resposne.ok) {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: data,
        });
        return;
      }

      // store the token in the local storage
      localStorage.setItem("token", data.token);
      dispatch({
        type: "LOGIN",
        payload: data,
      });
    } catch (error) {
      console.log("error:-", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: {
          message: "Internal server error!",
        },
      });
      return;
    }
  };

  // defining the signup action
  const signup = async (data) => {
    const { email, password } = data;
    dispatch({
      type: "SIGNUP_REQUEST",
    });

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "signup",
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Signup failed");
        dispatch({
          type: "SIGNUP_FAILURE",
          payload: data,
        });
        return;
      }

      localStorage.setItem("token", data.token);

      dispatch({
        type: "SIGNUP",
        payload: data,
      });
    } catch (error) {
      console.log("error:-", error);
      dispatch({
        type: "SIGNUP_FAILURE",
        payload: {
          message: "Internal server error!",
        },
      });
    }
    return;
  };

  // set user
  const updateUser = (user) => {
    dispatch({
      type: "SET_USER",
      payload: user,
    });
  };

  // defining the logout action
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        signup,
        updateUser,
        logout,
        isTokenValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export the context and the provider
export default AuthContext;
