import { useState } from "react";

const EditProfile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });
  const [imageLoading, setImageLoading] = useState(false);
  const fetcher = "useFetcher();";

  const handleImageChange = (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUser({ ...user, profilePicture: reader.result });
    };
    setImageLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted");
    fetcher.submit(
      {
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      },
      {
        method: "PATCH",
      }
    );
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      {/* Response Message */}
      {fetcher.error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
          {fetcher.error}
        </div>
      )}

      <div className="max-w-md w-full bg-blue-100 shadow-lg rounded-lg overflow-hidden">
        <form onSubmit={handleFormSubmit}>
          <div className="p-4 flex flex-col items-center">
            {/* Profile Picture */}

            <div className="relative w-32 h-32 ">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                  <div className="h-8 w-8 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={user.profilePicture}
                alt="Profile"
                className="rounded-full w-full h-full object-cover shadow-md"
              />
              {!imageLoading && (
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0"
                  accept="image/*"
                />
              )}
              {/* <button
                  disabled
                  className="absolute right-0 bottom-0 bg-blue-500 text-white rounded-full p-2"
                ></button> */}
            </div>

            {/* username */}
            <input
              type="text"
              // value={}
              name="username"
              value={user.username}
              onChange={(e) => {
                setUser({ ...user, username: e.target.value });
              }}
              className="w-full my-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email */}
            <input
              type="email"
              // value={user.email}
              name="email"
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Button */}

          <div className="bg-gray-50 p-4 text-center">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
