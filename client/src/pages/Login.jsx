import { Link } from "react-router-dom";
import { useState } from "react";
import { ErrorMessage } from "../components";
import { GoogleLogin } from "@react-oauth/google";

import useAuth from "../hooks/useAuth";
// import { FaCrown } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { login, state, googleAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    await login(userData);
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      console.log(response);
      const { given_name, email, picture } = jwtDecode(response.credential);
      console.log(given_name);
      console.log(jwtDecode(response.credential));
      const userData = {
        username: given_name,
        email,
        imageUrl: picture,
      };
      await googleAuth(userData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center p-10 bg-gray-50">
      <div className="border px-3 py-6 rounded  w-80 shadow-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 mb-2"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full font-semibold bg-blue-600 text-white py-2 rounded hover:bg-blue-500">
            Sign In
          </button>
        </form>

        <div className="my-4">
          <p className="text-gray-700">
            Don&apos;t have an account? &nbsp;
            <Link to="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <p className="text-center font-bold text-gray-700">OR</p>

        <div className="flex my-2 items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
            text="Signin"
            size="large"
            theme="filled_blue"
            width="296"
          />
        </div>

        <p className="text-gray-700 mt-4 text-right">
          <Link to="/auth/otplogin" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>

        {state.error ? <ErrorMessage message={state.message} /> : ""}
      </div>
    </div>
  );
};

export default Login;
