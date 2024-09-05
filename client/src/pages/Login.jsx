import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">Log In</h1>
      <form className="w-full max-w-sm space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
        >
          Log In
        </button>
      </form>
      <div className="mt-4">
        <p className="text-gray-700">Don&apos;t have an account?</p>
        <Link to="/auth/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
