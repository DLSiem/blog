import { Link } from "react-router-dom";
import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { GoogleLogin } from "@react-oauth/google";

import useAuth from "../hooks/useAuth";

import { jwtDecode } from "jwt-decode";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, signup, googleAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    await signup(userData);
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      console.log(response);
      const { given_name, email, picture } = jwtDecode(response.credential);
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
    <div className="flex flex-col justify-center  items-center p-10  bg-gray-50">
      <div className="border px-3 py-6 rounded  w-80 shadow-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="w-full font-bold bg-green-600 text-white py-2 rounded hover:bg-green-500">
            Sign Up
          </button>
        </form>
        <div className="my-4">
          <p className="text-gray-700">
            Don&apos;t have an account? &nbsp;
            <Link to="/auth/login" className="text-blue-600 hover:underline">
              Sign In
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
            text="signup_with"
            size="large"
            theme="filled_blue"
            width="296"
          />
        </div>

        {state.error ? <ErrorMessage message={state.message} /> : ""}
      </div>
    </div>
  );
};

export default Signup;
