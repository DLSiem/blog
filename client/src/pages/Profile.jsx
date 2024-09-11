import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

// import { ToastContainer, toast } from "react-toastify";

// const { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET } =
//   import.meta.env;

const Profile = () => {
  const { state } = useAuth();
  const user = state.user;
  const loading = state.loading;

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
    <div className="flex items-center justify-center bg-gray-100 p-4">
      {/* <ToastContainer /> */}
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative w-32 h-32">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="rounded-full w-full h-full object-cover shadow-md"
            />
          </div>

          {/* Username */}
          <h2 className="text-xl font-bold mt-4 text-gray-800">
            {user.username}
          </h2>

          {/* Email */}
          <p className="text-gray-600 mt-2">{user.email}</p>
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
  );
};

export default Profile;
