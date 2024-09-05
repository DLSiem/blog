import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">Authentication</h1>
      <div className="space-x-4">
        <Link
          to="login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Login
        </Link>
        <Link
          to="signup"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Auth;
