import {} from "react";
import { FaThumbsUp, FaEye, FaCommentDots } from "react-icons/fa";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const BlogPage = () => {
  const { blog } = useLoaderData();
  const { state } = useAuth();
  const navigate = useNavigate();
  const isAuth = state.isAuthenticated;
  const userId = state.user?._id;

  if (!blog) {
    return <div>Loading...</div>;
  }

  const onClickDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${blog._id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Delete button */}
      <div className="bg-white shadow-lg rounded-lg my-2  py-2 flex items-center justify-between">
        <div className="px-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            BACK
          </button>
        </div>
        <div className="px-2">
          {isAuth && userId === blog.author._id && (
            <>
              <Link
                to={`update`}
                className="px-4  py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
              >
                Edit Blog
              </Link>
              <button
                onClick={onClickDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Blog
              </button>
            </>
          )}
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{blog.title}</h1>
        {/* Blog Image */}
        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        {/* Blog Title */}

        {/* Blog Meta Data */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-gray-500">
              <strong>By:</strong> {blog.author.username}
            </span>
            <span className="text-gray-500 ml-4">
              <strong>Category:</strong> {blog.category.name}
            </span>
            <span className="text-gray-500 ml-4">
              <strong>Published:</strong>{" "}
              {new Date(blog.createdAt).toDateString()}
            </span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="text-gray-700 leading-relaxed mb-8">{blog.content}</div>

        {/* Blog Tags */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Tags</h3>
          <div className="flex space-x-2 mt-2">
            {blog.tags.map((tag) => (
              <Link
                to={`/tags/${tag.slug}`}
                key={tag._id}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Actions */}
        <div className="flex items-center mb-6">
          <div className="flex items-center mr-6">
            <FaThumbsUp className="text-blue-500 mr-1" />
            <span>{blog.likes} Likes</span>
          </div>
          <div className="flex items-center mr-6">
            <FaEye className="text-green-500 mr-1" />
            <span>{blog.views} Views</span>
          </div>
          <div className="flex items-center">
            <FaCommentDots className="text-yellow-500 mr-1" />
            <span>{blog.comments.length} Comments</span>
          </div>
        </div>

        {/* Blog Comments */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
          {blog.comments.length > 0 ? (
            <ul>
              {blog.comments.map((comment) => (
                <li key={comment._id} className="mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800">
                      {comment.user.name}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
