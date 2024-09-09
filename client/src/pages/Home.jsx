// import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const Home = () => {
  const { blogs } = useLoaderData();

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
                <Link to={`/${blog.slug}`}>{blog.title}</Link>
              </h3>
              <p className="text-gray-600 mb-4">
                {blog.excerpt || blog.content.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">By {blog.author}</span>
                <Link
                  to={`/${blog.slug}`}
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
