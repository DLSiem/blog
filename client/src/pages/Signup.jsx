import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center  items-center  bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">Sign Up</h1>
      <form className="w-full max-w-sm space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-4">
        <p className="text-gray-700">Already have an account?</p>
        <Link to="/auth/login" className="text-green-600 hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
