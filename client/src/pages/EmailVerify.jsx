import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { user } = state;
  const isEmailVerified = user?.emailVerified;
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/auth/sendemailverification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user?.email }),
        }
      );
      if (!response.ok) {
        setPageLoading(false);
        throw new Error("Email verification failed");
      }

      setIsEmailSent(true);
      const data = await response.json();

      console.log(data.preURL);
      setPageLoading(false);
    } catch (error) {
      setPageLoading(false);
      console.error(error);
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 mt-40">
          <p className="text-green-600 text-lg font-semibold">
            Email verification link has been sent to your email
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isEmailVerified) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 mt-40">
          <p className="text-green-600 text-lg font-semibold">
            Your email is already verified
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className=" flex flex-col justify-center items-center p-10 bg-gray-50">
        <div className="border px-3 py-6 rounded  w-80 shadow-md">
          <h1 className="text-3xl font-extrabold text-center mb-6">
            Email Verify
          </h1>
          <p
            className="
            text-center
            text-yellow-600
            font-semibold
            text-sm
            bg-yellow-100
            px-4
            py-2
            rounded
            border
            mb-4
          "
          >
            If your email is not verified, your account could be suspended or
            deleted anytime along with you data and some features will be
            disabled until you verify your email.
          </p>
          <p className="text-center mb-6">
            Enter your email to verify your account
          </p>

          <form className="w-full max-w-sm space-y-4 mb-2">
            <p className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              {user?.email}
            </p>
            <button
              onClick={handleSubmit}
              disabled={pageLoading}
              className={`w-full font-semibold bg-blue-600 text-white py-2 rounded hover:bg-blue-500 ${
                pageLoading && "cursor-not-allowed"
              }`}
            >
              {pageLoading ? "Sending Email..." : "Send Verification Email"}
            </button>
          </form>
          <button
            onClick={() => navigate(-1)}
            className={`bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600  ${
              pageLoading && "cursor-not-allowed"
            }`}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
