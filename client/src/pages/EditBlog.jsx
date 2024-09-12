import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useFetcher, useNavigate, useLoaderData } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Cloudinary environment variables
const { VITE_CLOUDINARY_UPLOAD_PRESET, VITE_CLOUDINARY_CLOUD_NAME } =
  import.meta.env;

const EditBlog = () => {
  const navigate = useNavigate();
  const { blog } = useLoaderData();
  const { state } = useAuth();
  const fetcher = useFetcher();

  const [formData, setFormData] = useState({
    title: blog.title,
    content: blog.content,
    category: {
      value: blog.category._id,
      label: blog.category.name,
    },
    customCategory: "",
    tags: [
      ...blog.tags.map((tag) => ({
        value: tag._id,
        label: tag.name,
      })),
    ],
    customTags: "",
    imageUrl: blog.imageUrl,
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createCategory, setCreateCategory] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [saveImage, setSaveImage] = useState(false);

  // Fetch categories and tags when the component mounts
  useEffect(() => {
    getCategories();
    getTags();
    if (state.user._id !== blog.author._id) {
      console.log("User is not the author of this blog");
      navigate("/" + blog.slug);
    }
  }, []);

  if (!state.isAuthenticated) {
    navigate("/auth/login");
  }

  // Fetch categories from the backend
  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/categories");
      const categoryOptions = response.data.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategories(categoryOptions);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tags from the backend
  const getTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/tags");
      const tagOptions = response.data.map((tag) => ({
        value: tag._id,
        label: tag.name,
      }));
      setTags(tagOptions);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setSaveImage(true);
    setFormData({
      ...formData,
      imageUrl: URL.createObjectURL(e.target.files[0]),
    });
  };

  // Handle image save
  const handleSaveImage = async () => {
    setImageLoading(true);
    const file = document.getElementById("imageUrl").files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );
      setFormData({ ...formData, imageUrl: response.data.secure_url });
      setSaveImage(false);
    } catch (error) {
      console.error("Error uploading image: ", error);
    } finally {
      setSaveImage(false);
      setImageLoading(false);
    }
  };

  // Handle tag change
  const handleTagChange = (selectedTags) => {
    setFormData({
      ...formData,
      tags: selectedTags,
    });
  };

  // Handle category change
  const handleCategoryChange = (selectedCategory) => {
    setFormData({ ...formData, category: selectedCategory });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category && !formData.customCategory) {
      return setError("Please select a category or enter a custom category");
    }

    if (!formData.tags.length && !formData.customTags) {
      return setError("Please select tags or enter custom tags");
    }

    setError(null);

    if (createCategory) {
      formData.category = formData.customCategory;
    }

    let tagsArray = formData.tags.map((tag) => tag.label);

    if (formData.customTags) {
      tagsArray = [...tagsArray, ...formData.customTags.split(",")];
    }

    const blogData = {
      author: state.user._id,
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl,
      category: formData.category.label,
      tags: tagsArray,
    };

    fetcher.submit(blogData, {
      method: "POST",
    });
  };

  useEffect(() => {
    if (fetcher.data) {
      console.log("Data from fetcher: ", fetcher.data);
      if (fetcher.data.ok) {
        navigate("/" + fetcher.data.blog.slug);
      } else {
        setError(fetcher.data.message);
      }
    }

    if (fetcher.error) {
      console.error("Error from fetcher: ", fetcher.error);
    }
  }, [fetcher.data, fetcher.error, fetcher.loading, navigate, fetcher.blog]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Update Blog Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="title"
          >
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          {imageLoading && (
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 border-t-2 border-b-2 mt-16 absolute border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={formData.imageUrl}
            alt="BLOG IMAGE"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          {!imageLoading && (
            <div className="flex justify-between">
              <div>
                <input
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  onChange={handleImageChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  accept="image/*"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Upload a blog image (optional)
                </p>
              </div>
              {saveImage && (
                <input
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                  type="button"
                  value="SAVE"
                  onClick={handleSaveImage}
                />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="content"
          >
            Blog Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="8"
            placeholder="Write your blog content..."
            required
          />
        </div>
        {createCategory ? (
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="customCategory"
            >
              Custom Category
            </label>
            <input
              type="text"
              id="customCategory"
              name="customCategory"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter custom category"
            />
          </div>
        ) : (
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <Select
              name="category"
              options={categories} // The list of categories fetched from backend
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full"
              placeholder={
                loading ? "Loading categories..." : "Select a category"
              }
            />
          </div>
        )}

        {/* Custom Category */}

        <input
          type="button"
          onClick={() => setCreateCategory(!createCategory)}
          className="bg-green-600 text-white px-6 py-2 rounded-md mt-2 font-semibold hover:bg-green-700 transition duration-300"
          value={createCategory ? "Select Category" : "+ Create Category"}
        />

        {/* Tags */}
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="tags"
          >
            Tags (select multiple)
          </label>
          <Select
            isMulti
            name="tags"
            options={tags} // The list of tags fetched from backend
            value={formData.tags}
            onChange={handleTagChange}
            className="w-full"
            placeholder={loading ? "Loading tags..." : "Select tags"}
          />
        </div>

        {/* custom tags */}

        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="customTags"
          >
            Custom Tags
          </label>
          <input
            type="text"
            id="customTags"
            name="customTags"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter custom tags eg: tag1, tag2, tag3"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Submit Blog
          </button>
        </div>
      </form>
      {/* Error */}
      {error && <div className="text-red-500 mt-4 ">{error}</div>}
    </div>
  );
};

export default EditBlog;
