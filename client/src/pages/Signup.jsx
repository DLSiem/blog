import { Link } from "react-router-dom";
import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";

import { useAuth } from "../hooks/useAuth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    await signup(userData);
  };
  if (state.isAuthenticated) {
    return <h1>You are already Signin in</h1>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center  items-center  bg-gray-50">
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
        <div className="my-4 ">
          <p>
            Already have an account? &nbsp;
            <Link to="/auth/login" className="text-green-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>

        {state.error ? <ErrorMessage message={state.message} /> : ""}
      </div>
    </div>
  );
};

export default Signup;
