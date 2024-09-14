import { useLoaderData, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const EmailVerifyMessage = () => {
  const { state } = useAuth();
  const userId = state.user?._id;
  const { message, ok } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center">
      <div
        className={`flex items-center p-6 rounded-lg shadow-md w-full max-w-lg ${
          ok
            ? "bg-green-100 border-green-500 text-green-700"
            : "bg-red-100 border-red-500 text-red-700"
        } border-2`}
      >
        <div className="mr-4">
          {ok ? (
            <FaCheckCircle className="text-4xl" />
          ) : (
            <FaTimesCircle className="text-4xl" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{ok ? "Success!" : "Error!"}</h2>
          <p className="mt-2">{message}</p>
        </div>
      </div>
      <button
        onClick={() => navigate(`/profile/${userId}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  );
};

export default EmailVerifyMessage;
