import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useFetcher } from "react-router-dom";

const { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET } =
  import.meta.env;

const EditProfile = () => {
  const { state } = useAuth();
  // const navigate = useNavigate();
  const [user, setUser] = useState({
    username: state.user.username,
    email: state.user.email,
    profilePicture: state.user.profilePicture,
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [saveImage, setSaveImage] = useState(false);
  const fetcher = useFetcher();

  const handleImageChange = (e) => {
    setSaveImage(true);
    setUser({
      ...user,
      profilePicture: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleImageSave = async () => {
    setImageLoading(true);
    const file = document.getElementById("imageUrl").files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json();
      if (!response.ok) {
        setImageLoading(false);
        setSaveImage(false);
        console.log("Error uploading image");
        return;
      }
      setUser({ ...user, profilePicture: res.secure_url });
      setImageLoading(false);
      setSaveImage(false);
    } catch (error) {
      console.log(error);
      imageLoading(false);
      setSaveImage(false);
      return;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    setImageLoading(false);
    console.log("Form Submitted");
    console.log(user.profilePicture);
    fetcher.submit(user, {
      method: "PATCH",
    });
  };

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.ok) {
        console.log("Success");
        window.location.href = "/profile";
      } else {
        console.log("Error:-", fetcher.data.message);
      }
    }
  }, [fetcher.data]);

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      {/* Response Message */}
      {fetcher.error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
          {fetcher.error}
        </div>
      )}

      <div className="max-w-md w-full bg-green-50 shadow-lg rounded-lg overflow-hidden">
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
                  id="imageUrl"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0"
                  accept="image/*"
                />
              )}
              {saveImage && (
                <input
                  type="button"
                  onClick={handleImageSave}
                  value={imageLoading ? "Uploading..." : "Upload"}
                  className="absolute text-xs right-0 bottom-0 bg-blue-500 text-white rounded-full p-2"
                />
              )}
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
