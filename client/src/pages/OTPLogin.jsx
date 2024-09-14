import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ErrorMessage } from "../components";

const OTPLogin = () => {
  const navigate = useNavigate();
  const { state, otpLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(0);

  // when the user is at the OTP verification stage count to 60 seconds and then enable the resend button
  if (submitted) {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
    if (counter === 60) {
      setCounter(0);
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {
      email,
      otp,
    };
    await otpLogin(userData);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center  bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
            Verify OTP
          </h1>
          <p
            className="
           text-sm text-teal-700 font-bold text-center
          "
          >
            OTP has been sent to your email address. Please enter the OTP here
          </p>
          <form onSubmit={handleOTPSubmit}>
            <div className="my-4 flex justify-center">
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="px-4 py-2 w-full border text-center text-5xl text-gray-700 font-bold h-20  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="OTP"
                maxLength="6"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 font-semibold rounded-lg transition duration-300 
            ${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } text-white flex justify-center items-center`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.5 1.15 4.72 2.938 6.292l1.062-1.001z"
                  />
                </svg>
              ) : (
                "Submit OTP"
              )}
            </button>
          </form>
          {state.error && <ErrorMessage message={state.error} />}
          {error && (
            <p className="text-red-500 font-bold bg-red-100 border border-red-400 px-4 py-2 rounded-lg mt-4">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  const handleOTPRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/otplogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          Request OTP
        </h1>
        <form onSubmit={handleOTPRequest}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold rounded-lg transition duration-300 
            ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white flex justify-center items-center transition duration-400`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.5 1.15 4.72 2.938 6.292l1.062-1.001z"
                />
              </svg>
            ) : (
              "Request OTP"
            )}
          </button>
        </form>
        {error && (
          <p className="text-red-500 font-bold bg-red-100 border border-red-400 px-4 py-2 rounded-lg mt-4">
            {error}
          </p>
        )}

        <p className="mt-6 text-right">
          Don&apos;t have an account?{" "}
          <Link
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OTPLogin;
