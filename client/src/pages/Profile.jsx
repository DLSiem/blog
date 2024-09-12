import useAuth from "../hooks/useAuth";
import { Link, useLoaderData } from "react-router-dom";

const Profile = () => {
  const { state } = useAuth();
  const user = state.user;
  const loading = state.loading;
  const { blogs } = useLoaderData();
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 mt-40">
          {/* Loading spinner */}
          <div className="h-16 w-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          {/* Fade-in loading text */}
          <p className="text-blue-600 text-lg font-semibold animate-pulse">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 p-4">
        {/* <ToastContainer /> */}
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative w-32 h-32">
              <img
                src={user?.profilePicture}
                alt="Profile"
                className="rounded-full w-full h-full object-cover shadow-md"
              />
            </div>

            {/* Username */}
            <h2 className="text-xl font-bold mt-4 text-gray-800">
              {user?.username}
            </h2>

            {/* Email */}
            <p className="text-gray-600 mt-2">{user?.email}</p>
          </div>

          {/* Edit Profile Button */}
          <div className="bg-gray-50 p-4 text-center">
            <Link
              to="update"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 text-underline border-b-2">
              Your Blogs
            </h2>
          </div>

          {blogs.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-700">
                You have not written any blogs yet.{" "}
                <Link to="/create" className="text-blue-500">
                  Write one now
                </Link>
              </p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="p-4 border-b border-gray-200 flex items-center  justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600">
                    {blog.content.substring(0, 100)}
                  </p>
                </div>
                <Link
                  to={`/${blog.slug}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
