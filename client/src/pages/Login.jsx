import { Link } from "react-router-dom";
import { useState } from "react";
import { ErrorMessage } from "../components";

import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login, state } = useAuth();
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="border px-3 py-6 rounded  w-80 shadow-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">Log In</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
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
            Log In
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
        {state.error ? <ErrorMessage message={state.message} /> : ""}
      </div>
    </div>
  );
};

export default Login;
