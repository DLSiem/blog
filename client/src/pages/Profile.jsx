import { useState } from "react";

import useAuth from "../hooks/useAuth";

// import { ToastContainer, toast } from "react-toastify";

// const { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET } =
//   import.meta.env;

const Profile = () => {
  // const { loading, setUser } = useContext(UserContext);
  const [editProfile, setEditProfile] = useState(false);
  // const [imageLoading, setImageLoading] = useState(false);
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

  const handleEditButton = () => {
    setEditProfile(!editProfile);
  };

  // if (editProfile) {
  //   const handleImageChange = async (e) => {
  //     setImageLoading(true);
  //     const file = e.target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       setUser({ ...user, profilePicture: reader.result });
  //     };

  //     const data = new FormData();
  //     data.append("file", file);
  //     data.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
  //     data.append("cloud_name", VITE_CLOUDINARY_CLOUD_NAME);
  //     data.append("folder", "Cloudinary-React");

  //     try {
  //       const response = await fetch(
  //         `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
  //         {
  //           method: "POST",
  //           body: data,
  //         }
  //       );
  //       const res = await response.json();
  //       setUser({ ...user, profilePicture: res.secure_url });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setImageLoading(false);
  //   };

  //   const handleFormSubmit = async (e) => {
  //     e.preventDefault();
  //     console.log("Form Submitted");
  //     fetcher.submit(
  //       {
  //         email: user.email,
  //         username: user.username,
  //         profilePicture: user.profilePicture,
  //       },
  //       {
  //         method: "PATCH",
  //       }
  //     );
  //     setEditProfile(false);
  //   };

  //   return (
  //     <div className="flex items-center justify-center bg-gray-100 p-4">
  //       {/* Response Message */}
  //       {fetcher.error && (
  //         <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
  //           {fetcher.error}
  //         </div>
  //       )}

  //       <div className="max-w-md w-full bg-blue-100 shadow-lg rounded-lg overflow-hidden">
  //         <form onSubmit={handleFormSubmit}>
  //           <div className="p-4 flex flex-col items-center">
  //             {/* Profile Picture */}

  //             <div className="relative w-32 h-32 ">
  //               {imageLoading && (
  //                 <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
  //                   <div className="h-8 w-8 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
  //                 </div>
  //               )}
  //               <img
  //                 src={user.profilePicture}
  //                 alt="Profile"
  //                 className="rounded-full w-full h-full object-cover shadow-md"
  //               />
  //               {!imageLoading && (
  //                 <input
  //                   type="file"
  //                   name="profilePicture"
  //                   onChange={handleImageChange}
  //                   className="absolute inset-0 w-full h-full opacity-0"
  //                   accept="image/*"
  //                 />
  //               )}
  //               {/* <button
  //                 disabled
  //                 className="absolute right-0 bottom-0 bg-blue-500 text-white rounded-full p-2"
  //               ></button> */}
  //             </div>

  //             {/* username */}
  //             <input
  //               type="text"
  //               // value={}
  //               name="username"
  //               value={user.username}
  //               onChange={(e) => {
  //                 setUser({ ...user, username: e.target.value });
  //               }}
  //               className="w-full my-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             />

  //             {/* Email */}
  //             <input
  //               type="email"
  //               // value={user.email}
  //               name="email"
  //               value={user.email}
  //               onChange={(e) => {
  //                 setUser({ ...user, email: e.target.value });
  //               }}
  //               className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             />
  //           </div>

  //           {/* Save Button */}

  //           <div className="bg-gray-50 p-4 text-center">
  //             <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
  //               Save
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // }

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
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleEditButton}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
