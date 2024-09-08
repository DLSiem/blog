import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([
    {
      _id: "123456",
      title: "Blog Post 1",
      content: "This is the content of blog post 1",
      excerpt: "This is a short excerpt for blog post 1",
      authorName: "John Doe",
    },
    {
      _id: "654321",
      title: "Blog Post 2",
      content: "This is the content of blog post 2",
      excerpt: "This is a short excerpt for blog post 2",
      authorName: "Jane Smith",
    },
  ]);

  // Fetch blogs from an API (replace with actual API call)
  useEffect(() => {
    // Simulate fetching blog data
    const fetchBlogs = async () => {
      // Replace this with actual API call to your backend
      const response = await fetch("http://localhost:3000/api/blogs");
      const data = await response.json();
      setBlogs(data);
    };

    fetchBlogs();
  }, []);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Latest Blogs</h1>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2 text-blue-600 hover:underline">
                <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
              </h3>
              <p className="text-gray-600 mb-4">
                {blog.excerpt || blog.content.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  By {blog.authorName}
                </span>
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">
          No blogs available right now. Please check back later.
        </p>
      )}
    </div>
  );
};

export default Home;
