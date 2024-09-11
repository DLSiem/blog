import { useState } from "react";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    imageUrl: null,
  });

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageUrl") {
      setFormData({
        ...formData,
        [name]: files[0], // For file uploads
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would usually make an API call to save the blog post
    console.log(formData);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create a New Blog
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
          <img
            src="https://res.cloudinary.com/du0k3njhg/image/upload/v1725788607/Cloudinary-React/vdth7t5emrosvognxnxp.jpg"
            alt=""
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  "
            accept="image/*"
          />
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

        {/* Category */}
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category</option>
            <option value="web-development">Web Development</option>
            <option value="design">Design</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="tags"
          >
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tags (e.g. react, javascript)"
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
    </div>
  );
};

export default CreateBlog;
